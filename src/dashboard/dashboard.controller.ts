import { Controller, Get } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles('admin')
  @Get('summary')
  async getSummary() {
    return await this.dashboardService.getSummary();
  }

  @Roles('admin')
  @Get('monthly-traffic')
  async getMonthlyTrafiic() {
    return await this.dashboardService.getMonthlyTraffic();
  }

  @Roles('admin')
  @Get('content-categories')
  async getPopularContentCategories() {
    return await this.dashboardService.getPopularContentCategories();
  }

  @Roles('admin')
  @Get('popular-contents')
  async getPopularContents() {
    return await this.dashboardService.getPopularContents();
  }

  @Roles('admin', 'project-approver')
  @Get('projects')
  async getProjectDashboard() {
    return await this.dashboardService.getProjectDashboard();
  }
}
