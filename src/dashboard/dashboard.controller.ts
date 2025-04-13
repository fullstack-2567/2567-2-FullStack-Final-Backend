import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { DashboardService } from './dashboard.service';
import { getMonthIfNotSpecified } from 'src/utils/dashboard.utils';
import { DashboardSummaryResponseDto } from 'src/dto/response/dashboard/summary.response.dto';
import { MonthlyTrafficResponseDto } from 'src/dto/response/dashboard/monthly-traffic.response.dto';
import { ContentCategoriesResponseDto } from 'src/dto/response/dashboard/content-categories.response.dto';
import { PopularContentsResponseDto } from 'src/dto/response/dashboard/popular-contents.response.dto';
import { ProjectsDashboardResponseDto } from 'src/dto/response/dashboard/projects.response.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({
    operationId: 'getDashboardSummary',
    summary: 'Get dashboard summary statistics',
  })
  @ApiQuery({
    name: 'month',
    required: false,
    description: 'Month in YYYY-MM format',
  })
  @ApiResponse({ status: 200, type: DashboardSummaryResponseDto })
  @Roles('admin')
  @Get('summary')
  async getSummary(@Query('month') month?: string) {
    return await this.dashboardService.getSummary(
      getMonthIfNotSpecified(month),
    );
  }

  @ApiOperation({
    operationId: 'getDashboardMonthlyTraffic',
    summary: 'Get monthly traffic statistics',
  })
  @ApiQuery({
    name: 'month',
    required: false,
    description: 'Month in YYYY-MM format',
  })
  @ApiResponse({ status: 200, type: MonthlyTrafficResponseDto })
  @Roles('admin')
  @Get('monthly-traffic')
  async getMonthlyTrafiic(@Query('month') month?: string) {
    return await this.dashboardService.getMonthlyTraffic(
      getMonthIfNotSpecified(month),
    );
  }

  @ApiOperation({
    operationId: 'getDashboardPopularContentCategories',
    summary: 'Get popular content categories',
  })
  @ApiQuery({
    name: 'month',
    required: false,
    description: 'Month in YYYY-MM format',
  })
  @ApiResponse({ status: 200, type: ContentCategoriesResponseDto })
  @Roles('admin')
  @Get('content-categories')
  async getPopularContentCategories(@Query('month') month?: string) {
    return await this.dashboardService.getPopularContentCategories(
      getMonthIfNotSpecified(month),
    );
  }

  @ApiOperation({
    operationId: 'getDashboardPopularContents',
    summary: 'Get popular contents',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of results to return',
    type: Number,
  })
  @ApiQuery({
    name: 'month',
    required: false,
    description: 'Month in YYYY-MM format',
  })
  @ApiResponse({ status: 200, type: PopularContentsResponseDto })
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

  @ApiOperation({
    operationId: 'getProjectDashboard',
    summary: 'Get project dashboard statistics',
  })
  @ApiQuery({
    name: 'month',
    required: false,
    description: 'Month in YYYY-MM format',
  })
  @ApiResponse({ status: 200, type: ProjectsDashboardResponseDto })
  @Roles('admin', 'project-approver')
  @Get('projects')
  async getProjectDashboard(@Query('month') month?: string) {
    return await this.dashboardService.getProjectDashboard(
      getMonthIfNotSpecified(month),
    );
  }
}
