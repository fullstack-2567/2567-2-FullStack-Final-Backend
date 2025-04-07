import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Roles('admin')
  @Get('users')
  async getUsersReport() {
    return await this.reportsService.getUsersReport();
  }

  @Roles('admin')
  @Get('contents')
  async getContentsReport() {
    return await this.reportsService.getContentsReport();
  }

  @Roles('admin')
  @Get('projects')
  async getProjectsReport() {
    return await this.reportsService.getProjectsReport();
  }
}
