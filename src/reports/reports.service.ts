import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from 'src/entities/project.entity';
import { UserContentReport } from 'src/entities/user_content_report.entity';
import { User } from 'src/entities/user.entity';
import { Op } from 'sequelize';
import { Content } from 'src/entities/content.entitiy';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Project) private readonly projectRepository: typeof Project,
    @InjectModel(UserContentReport)
    private readonly userContentReportRepository: typeof UserContentReport,
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectModel(Content) private readonly contentRepository: typeof Content,
  ) {}

  async getUsersReport() {
    // Get all users with their content reports
    const users = await this.userRepository.findAll({
      include: [
        {
          model: UserContentReport,
          attributes: [],
        },
      ],
    });

    // Process each user to get the required data
    const userDataPromises = users.map(async (user) => {
      // Count total courses taken
      const coursesTaken = await this.userContentReportRepository.count({
        where: { userId: user.userId },
      });

      // Count completed courses
      const coursesCompleted = await this.userContentReportRepository.count({
        where: {
          userId: user.userId,
          completedDT: { [Op.ne]: null },
        },
      });

      return {
        id: user.userId,
        name: `${user.firstName} ${user.lastName}`,
        coursesTaken,
        coursesCompleted,
      };
    });

    return Promise.all(userDataPromises);
  }

  async getContentsReport() {
    // Get all content/courses
    const contents = await this.contentRepository.findAll();

    // Process each content to get the required data
    const contentDataPromises = contents.map(async (content) => {
      // Count total students enrolled
      const studentsEnrolled = await this.userContentReportRepository.count({
        where: { contentId: content.contentId },
      });

      // Count students who completed the course
      const studentsCompleted = await this.userContentReportRepository.count({
        where: {
          contentId: content.contentId,
          completedDT: { [Op.ne]: null },
        },
      });

      return {
        id: content.contentId,
        title: content.contentName,
        studentsEnrolled,
        studentsCompleted,
      };
    });

    return Promise.all(contentDataPromises);
  }

  async getProjectsReport() {
    // Get all projects with their submitters
    const projects = await this.projectRepository.findAll({
      include: [
        {
          model: User,
          as: 'submittedByUser',
          attributes: ['firstName', 'lastName'],
        },
      ],
    });

    // Process each project to get the required data
    return projects.map((project) => {
      // Determine project status based on approval dates
      let status = 'กำลังรอการตรวจสอบ';
      if (project.rejectedDT) {
        status = 'ถูกปฏิเสธ';
      } else if (project.thirdApprovedDT) {
        status = 'ตรวจสอบสำเร็จ';
      } else if (project.secondApprovedDT) {
        status = 'ผ่านการตรวจสอบรอบที่ 2';
      } else if (project.firstApprovedDT) {
        status = 'ผ่านการตรวจสอบรอบที่ 1';
      }

      return {
        id: project.projectId,
        projectName: project.projectEngName,
        submitter: `${project.submittedByUser.firstName} ${project.submittedByUser.lastName}`,
        status,
      };
    });
  }
}
