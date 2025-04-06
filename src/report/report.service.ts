import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Report} from 'src/entities/report.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer'; 
import * as ejs from 'ejs';
import { ReportType } from 'src/types/enums';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { Content } from 'src/entities/content.entity';
import { ContentMap } from 'src/entities/content-map.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report)
    private readonly reportModel: typeof Report,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Content) private contentModel: typeof Content,
    @InjectModel(ContentMap) private contentMapModel: typeof ContentMap,
  ) {}

  async createReport(
    reportType: ReportType,
    userId: string,
    htmlContent?: string,
    fileName?: string,
    isUserReport?: boolean,
  ): Promise<Report> {
    const now = new Date();
    const dateStr = now.toISOString().replace('T', '_').substring(0, 19).replace(/:/g, '-');
    const reportScope = isUserReport ? 'user' : 'summary';
    const generatedFileName = fileName || `${reportType}_${reportScope}_report_${dateStr}.pdf`;

    // Path
    const baseDir = path.join(process.cwd(), 'reports');
    const subDir = path.join(baseDir, reportType);
    const filePath = path.join(subDir, generatedFileName);

    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir);
    }
    if (!fs.existsSync(subDir)) {
      fs.mkdirSync(subDir);
    }

    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      // ถ้ามี HTML จาก frontend → ใช้อันนั้นเลย
    let htmlInput: string;
    let courseStats = await this.getCourseStats();
    let userCourseStats = await this.getUserCourseStats();
    let projectTypeStats = await this.getProjectTypeStats();
    let projectUserStats = await this.getProjectUserStats();
    const user = await this.userModel.findByPk(userId);
    const userName = user ? `${user.prefix || ''} ${user.firstName || ''} ${user.lastName || ''}` : '';

    if (htmlContent) {
      htmlInput = htmlContent;
    } else {
    // ถ้าไม่มี → สร้างจาก EJS template

    if (reportType === 'elearning') {
      if (!isUserReport) {
        courseStats = await this.getCourseStats();
      } else {
        userCourseStats = await this.getUserCourseStats();
      }
    } else if (reportType === 'project') {
      if (!isUserReport) {
        projectTypeStats = await this.getProjectTypeStats();
      } else {
        projectUserStats = await this.getProjectUserStats();
      }
    }

    const templatePath = path.join(process.cwd(), 'src', 'report', 'report-templates', 'report.ejs');
    htmlInput = await ejs.renderFile(templatePath, {
        reportType,
        userName,
        date: new Date().toLocaleString('th-TH'),
        isUserReport,
        courseStats,
        userCourseStats,
        projectTypeStats,
        projectUserStats,
        });
      }

      // สร้าง PDF
      await page.setContent(htmlInput, { waitUntil: 'networkidle0' });
      await page.pdf({
        path: filePath,
        format: 'A4',
        printBackground: true,
      });
      await browser.close();

    } catch (err) {
      throw err;
    }

    const report = await this.reportModel.create({
      file_name: generatedFileName,
      report_type: reportType,
      create_by: userId,
    });

    if (!htmlContent) {
      return {
        ...(report.toJSON() as Report),
        previewUrl: `/report/preview/${report.reportId}`,
      } as Report & { previewUrl: string };
    }
    
    return report;
  }

  async getReportFilePathById(id: string): Promise<string> {
    const report = await this.reportModel.findByPk(id);
    if (!report) {
      throw new Error('Report not found');
    }

    const filePath = path.join(process.cwd(), 'reports', report.report_type, report.file_name);
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found on disk');
    }

    return filePath;
  }

  async getProjectDashboardSummary() {
    const projects = await this.projectModel.findAll();

    // จำนวนโปรเจคทั้งหมด
    const totalProjects = projects.length;

    // จำนวนผู้ส่งโปรเจคที่ไม่ซ้ำกัน
    const uniqueSubmitters = new Set(projects.map(p => p.submittedByUserId)).size;

    // รายชื่อผู้ส่งเรียงจากจำนวนโปรเจคมากไปน้อย
    const userProjectCount: Record<string, number> = {};
    projects.forEach(p => {
      if (!userProjectCount[p.submittedByUserId]) {
        userProjectCount[p.submittedByUserId] = 0;
      }
      userProjectCount[p.submittedByUserId]++;
    });
    const topSubmitters = Object.entries(userProjectCount)
      .sort((a, b) => b[1] - a[1])
      .map(([userId, count]) => ({ userId, count }))
      .slice(0, 20);;

    // ประเภทโปรเจคที่มีคนส่งมากที่สุด เรียงจากมากไปน้อย
    const projectTypeCount: Record<string, number> = {};
    projects.forEach(p => {
      if (!projectTypeCount[p.projectType]) {
        projectTypeCount[p.projectType] = 0;
      }
      projectTypeCount[p.projectType]++;
    });
    const topProjectTypes = Object.entries(projectTypeCount)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }))
      .slice(0, 20);

    // จำนวนโปรเจคที่ถูกยื่นในแต่ละวัน (สำหรับกราฟ)
    const projectCountPerDay: Record<string, number> = {};
    projects.forEach(p => {
      const dateStr = new Date(p.startDate).toISOString().split('T')[0];
      if (!projectCountPerDay[dateStr]) {
        projectCountPerDay[dateStr] = 0;
      }
      projectCountPerDay[dateStr]++;
    });
    const projectsByDate = Object.entries(projectCountPerDay)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count }));

    return {
      totalProjects,
      uniqueSubmitters,
      topSubmitters,
      topProjectTypes,
      projectsByDate,
    };
  }


  async getContentDashboardSummary() {
    // 1. จำนวนคอร์สทั้งหมด (จากตาราง Content)
    const totalCourses = await this.contentModel.count();
  
    // 2. จำนวนผู้เข้าเรียนทั้งหมด (จากตาราง ContentMap)
    const contentMaps = await this.contentMapModel.findAll({
      include: [
        { model: this.userModel, attributes: ['userId', 'firstName', 'lastName', 'prefix'] },
        { model: this.contentModel, attributes: ['contentId', 'contentName'] },
      ],
    });
    const totalEnrollments = contentMaps.length;
  
    // 3. จำนวนคนที่กำลังเรียนอยู่ (progress < 100)
    const activeLearners = contentMaps.filter(m => m.progress < 100).length;
  
    // 4. ชื่อคนที่เข้าเรียนเรียงจากมากไปน้อย (Top Learners)
    const learnerCountMap: Record<string, { userId: string; name: string; count: number }> = {};
    contentMaps.forEach(m => {
      const key = m.userId;
      if (!learnerCountMap[key]) {
        learnerCountMap[key] = {
          userId: m.userId,
          name: `${m.user?.prefix || ''} ${m.user?.firstName || ''} ${m.user?.lastName || ''}`.trim(),
          count: 0,
        };
      }
      learnerCountMap[key].count++;
    });
    const topLearners = Object.values(learnerCountMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  
    // 5. คอร์สที่มีคนเข้าเรียนเรียงมากไปน้อย (Popular Courses)
    const courseCountMap: Record<string, { contentId: string; contentName: string; count: number }> = {};
    contentMaps.forEach(m => {
      const key = m.contentId;
      if (!courseCountMap[key]) {
        courseCountMap[key] = {
          contentId: m.contentId,
          contentName: m.content?.contentName || '',
          count: 0,
        };
      }
      courseCountMap[key].count++;
    });
    const popularCourses = Object.values(courseCountMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  
    // 6. ปริมาณคนเข้าเรียนในแต่ละวัน (Enrollments by Day for Graph)
    const enrollPerDayMap: Record<string, number> = {};
    contentMaps.forEach(m => {
      const day = new Date(m.enrollAt).toISOString().split('T')[0];
      enrollPerDayMap[day] = (enrollPerDayMap[day] || 0) + 1;
    });
    const enrollmentsByDay = Object.entries(enrollPerDayMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count }));
  
    return {
      totalCourses,
      totalEnrollments,
      activeLearners,
      topLearners,
      popularCourses,
      enrollmentsByDay,
    };
  }  

  async getProjectTypeStats() {
    const projects = await this.projectModel.findAll();
  
    const statsMap: Record<string, { type: string; submitted: Set<string>; passed: Set<string> }> = {};
  
    for (const project of projects) {
      const type = project.projectType;
  
      if (!statsMap[type]) {
        statsMap[type] = {
          type,
          submitted: new Set(),
          passed: new Set(),
        };
      }
  
      statsMap[type].submitted.add(project.submittedByUserId);
  
      if (project.thirdApprovedDT) {
        statsMap[type].passed.add(project.submittedByUserId);
      }
    }
  
    return Object.values(statsMap).map(stat => ({
      type: stat.type,
      submitted: stat.submitted.size,
      passed: stat.passed.size,
    }));
  }

  async getProjectUserStats() {
    const projects = await this.projectModel.findAll({
      include: [{ model: this.userModel, as: 'submittedByUser' }],
    });
  
    const statsMap: Record<string, { name: string; submitted: number; passed: number; failed: number }> = {};
  
    for (const project of projects) {
      const userId = project.submittedByUserId;
      const name = `${project.submittedByUser?.prefix || ''} ${project.submittedByUser?.firstName || ''} ${project.submittedByUser?.lastName || ''}`.trim();
  
      if (!statsMap[userId]) {
        statsMap[userId] = {
          name,
          submitted: 0,
          passed: 0,
          failed: 0,
        };
      }
  
      statsMap[userId].submitted++;
  
      if (project.thirdApprovedDT) {
        statsMap[userId].passed++;
      } else if (project.rejectedDT) {
        statsMap[userId].failed++;
      }
    }
  
    return Object.values(statsMap);
  }
  
  async getUserCourseStats() {
    const contentMaps = await this.contentMapModel.findAll({
      include: [{ model: this.userModel }],
    });
  
    const statsMap: Record<string, { name: string; enrolled: number; completed: number }> = {};
  
    for (const map of contentMaps) {
      const userId = map.userId;
      const name = `${map.user?.prefix || ''} ${map.user?.firstName || ''} ${map.user?.lastName || ''}`.trim();
  
      if (!statsMap[userId]) {
        statsMap[userId] = {
          name,
          enrolled: 0,
          completed: 0,
        };
      }
  
      statsMap[userId].enrolled++;
  
      // ถือว่าจบคอร์สถ้า progress เต็ม 100 หรือมี completeAt
      if (map.progress === 100 || map.completeAt) {
        statsMap[userId].completed++;
      }
    }
  
    return Object.values(statsMap);
  }
  
  async getCourseStats() {
    const contentMaps = await this.contentMapModel.findAll({
      include: [
        {
          model: this.contentModel,
          attributes: ['contentId', 'contentName', 'contentCategory'],
        },
      ],
    });
  
    const statsMap: Record<string, {
      contentName: string;
      contentCategory: string;
      learners: number;
      completed: number;
    }> = {};
  
    for (const map of contentMaps) {
      const contentId = map.contentId;
      const contentName = map.content?.contentName;
      const contentCategory = map.content?.contentCategory;
  
      if (!statsMap[contentId]) {
        statsMap[contentId] = {
          contentName,
          contentCategory,
          learners: 0,
          completed: 0,
        };
      }
  
      statsMap[contentId].learners++;
  
      if (map.progress === 100 || map.completeAt) {
        statsMap[contentId].completed++;
      }
    }
  
    return Object.values(statsMap);
  }  

}
