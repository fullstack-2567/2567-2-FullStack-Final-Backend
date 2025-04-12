import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { Content } from 'src/entities/content.entitiy';
import { UserContentMaps } from 'src/entities/userContentMaps.entity';
import { Op } from 'sequelize';
import { getDateRange } from 'src/utils/dashboard.utils';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Project) private readonly projectRepository: typeof Project,
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectModel(Content) private readonly contentRepository: typeof Content,
    @InjectModel(UserContentMaps)
    private readonly userContentMapsRepository: typeof UserContentMaps,
  ) {}

  async getSummary(month: string) {
    // Implement summary logic
    return {};
  }

  async getMonthlyTraffic(month: string) {
    // Implement monthly traffic logic
    return {};
  }
  async getPopularContentCategories(month: string) {
    const { startDate, endDate } = getDateRange(month);

    const contentMaps = await this.userContentMapsRepository.findAll({
      where: {
        enrolledDT: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: Content,
          attributes: ['category'],
        },
      ],
    });

    // Count occurrences of each category
    const categoryCounts: Record<string, number> = {};
    contentMaps.forEach((map) => {
      const category = map.content.contentCategory;
      if (category) {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });

    // Convert to array and sort by count
    const sortedCategories = Object.entries(categoryCounts)
      .map(([category, contentCount]) => ({ category, contentCount }))
      .sort((a, b) => b.contentCount - a.contentCount);

    return {
      status: 'success',
      data: {
        categories: sortedCategories,
      },
    };
  }

  async getPopularContents(limit: number, month: string) {
    const { startDate, endDate } = getDateRange(month);

    // Find all enrollments in the specified month
    const contentEnrollments = await this.userContentMapsRepository.findAll({
      where: {
        enrolledDT: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: Content,
          attributes: ['contentId', 'contentName'],
        },
      ],
    });

    // Count enrollments for each content
    const contentCounts: Record<
      string,
      { contentId: string; contentName: string; enrollmentCount: number }
    > = {};

    contentEnrollments.forEach((enrollment) => {
      const contentId = enrollment.contentId;
      const contentName = enrollment.content.contentName;

      if (!contentCounts[contentId]) {
        contentCounts[contentId] = {
          contentId,
          contentName,
          enrollmentCount: 0,
        };
      }

      contentCounts[contentId].enrollmentCount += 1;
    });

    // Convert to array, sort by enrollment count, and limit results
    const popularContents = Object.values(contentCounts)
      .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
      .slice(0, limit);

    return {
      status: 'success',
      data: {
        courses: popularContents,
      },
    };
  }

  async getProjectDashboard(month: string) {
    const { startDate, endDate, lastMonthStartDate, lastMonthEndDate } =
      getDateRange(month);

    // Get all projects in a single query
    const allProjects = await this.projectRepository.findAll();

    // Filter projects for current and last month in memory
    const currentMonthProjects = allProjects.filter(
      (project) =>
        project.submittedDT >= startDate && project.submittedDT <= endDate,
    );

    const lastMonthProjects = allProjects.filter(
      (project) =>
        project.submittedDT >= lastMonthStartDate &&
        project.submittedDT <= lastMonthEndDate,
    );

    // Calculate summary statistics
    const summary = {
      pending_projects: {
        lastMonth: lastMonthProjects.filter(
          (p) => !p.firstApprovedDT && !p.rejectedDT,
        ).length,
        thisMonth: currentMonthProjects.filter(
          (p) => !p.firstApprovedDT && !p.rejectedDT,
        ).length,
      },
      total_projects: {
        lastMonth: lastMonthProjects.length,
        thisMonth: currentMonthProjects.length,
      },
      rejected_projects: {
        lastMonth: lastMonthProjects.filter((p) => p.rejectedDT).length,
        thisMonth: currentMonthProjects.filter((p) => p.rejectedDT).length,
      },
    };

    // Count project types
    const projectTypeCounts: Record<string, number> = {};
    currentMonthProjects.forEach((project) => {
      const type = project.projectType;
      projectTypeCounts[type] = (projectTypeCounts[type] || 0) + 1;
    });

    const popularProjectTypes = Object.entries(projectTypeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    // Count project statuses
    const projectStatus = {
      pending_first_approval: currentMonthProjects.filter(
        (p) => !p.firstApprovedDT && !p.rejectedDT,
      ).length,
      first_approved: currentMonthProjects.filter(
        (p) => p.firstApprovedDT && !p.secondApprovedDT,
      ).length,
      second_approved: currentMonthProjects.filter(
        (p) => p.secondApprovedDT && !p.thirdApprovedDT,
      ).length,
      third_approved: currentMonthProjects.filter((p) => p.thirdApprovedDT)
        .length,
      rejected: currentMonthProjects.filter((p) => p.rejectedDT).length,
    };

    // Count SDG types
    const sdgCounts: Record<string, number> = {};
    currentMonthProjects.forEach((project) => {
      const sdg = project.sdgType;
      sdgCounts[sdg] = (sdgCounts[sdg] || 0) + 1;
    });

    const popularSdgTypes = Object.entries(sdgCounts)
      .map(([sdg, count]) => ({ sdg, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    // Count child projects
    const childProjects = {
      normal: currentMonthProjects.filter((p) => !p.parentProjectID).length,
      child: currentMonthProjects.filter((p) => p.parentProjectID).length,
    };

    return {
      status: 'success',
      data: {
        summary,
        popular_project_types: popularProjectTypes,
        project_status: projectStatus,
        popular_sdg_types: popularSdgTypes,
        child_projects: childProjects,
      },
    };
  }
}
