import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersReportDto } from 'src/dto/response/usersReport.dto';
import { ContentsReportDto } from 'src/dto/response/contentsReport.dto';
import { ProjectsReportDto } from 'src/dto/response/projectsReport.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Roles('admin')
  @Get('users')
  @ApiOperation({
    operationId: 'getUsersReport',
    description: 'Get users report',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully get users report',
    type: [UsersReportDto],
  })
  async getUsersReport() {
    return await this.reportsService.getUsersReport();
  }

  @Roles('admin')
  @Get('contents')
  @ApiOperation({
    operationId: 'getContentsReport',
    description: 'Get contents report',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully get contents report',
    type: [ContentsReportDto],
  })
  async getContentsReport() {
    return await this.reportsService.getContentsReport();
  }

  @Roles('admin', 'project-approver')
  @Get('projects')
  @ApiOperation({
    operationId: 'getProjectsReport',
    description: 'Get projects report',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully get projects report',
    type: [ProjectsReportDto],
  })
  async getProjectsReport() {
    return await this.reportsService.getProjectsReport();
  }
}
