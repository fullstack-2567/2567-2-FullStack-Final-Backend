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
    // Implement project dashboard logic
    return {};
  }
}
