import { Controller, Get, Query } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { DashboardService } from './dashboard.service';
import { getMonthIfNotSpecified } from 'src/utils/dashboard.utils';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles('admin')
  @Get('summary')
  async getSummary(@Query('month') month?: string) {
    return await this.dashboardService.getSummary(
      getMonthIfNotSpecified(month),
    );
  }

  @Roles('admin')
  @Get('monthly-traffic')
  async getMonthlyTrafiic(@Query('month') month?: string) {
    return await this.dashboardService.getMonthlyTraffic(
      getMonthIfNotSpecified(month),
    );
  }

  @Roles('admin')
  @Get('content-categories')
  async getPopularContentCategories(@Query('month') month?: string) {
    return await this.dashboardService.getPopularContentCategories(
      getMonthIfNotSpecified(month),
    );
  }

  @Roles('admin')
  @Get('popular-contents')
  async getPopularContents(
    @Query('limit') limit: number = 5,
    @Query('month') month?: string,
  ) {
    return await this.dashboardService.getPopularContents(
      limit,
      getMonthIfNotSpecified(month),
    );
  }

  @Roles('admin', 'project-approver')
  @Get('projects')
  async getProjectDashboard(@Query('month') month?: string) {
    return await this.dashboardService.getProjectDashboard(
      getMonthIfNotSpecified(month),
    );
  }
}
