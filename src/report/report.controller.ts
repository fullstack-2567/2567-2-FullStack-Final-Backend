import { Controller, Post, Body, Req, BadRequestException, Get, Param, Res, Logger} from '@nestjs/common';
import { ReportService } from './report.service';
import { Report } from '../entities/report.entity';
import { CreateReportDto } from '../dto/create-report.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Request } from 'express';
import * as fs from 'fs';

// @ApiBearerAuth('accessToken') 
@ApiTags('report')  
@Controller('report')
export class ReportController {
  private readonly logger = new Logger(ReportController.name);

  constructor(private readonly reportService: ReportService) {}
  
   // @UseGuards(JwtAuthGuard('admin'))
  @Post('generateReport')
  @ApiOperation({ description: 'Generate a report for eLearning or Project module' })
  @ApiResponse({
    status: 201,
    description: 'Successfully generated report',
    type: Report,
  })
  async createReport(@Body() dto: CreateReportDto, @Req() req: Request): Promise<Report> {
    // const userId = req.user?.userId;
    const userId = dto.adminUserId;
    if (!userId) {
      throw new BadRequestException('adminUserId is required');
    }
    return this.reportService.createReport(dto.report_type, userId, dto.html, dto.fileName, dto.isUserReport);
  }

  // @UseGuards(JwtAuthGuard('admin'))
  @Get('preview/:id')
  @ApiOperation({ description: 'Preview report PDF in browser' })
  @ApiParam({ name: 'id', type: 'string' })
  async previewReport(@Param('id') id: string, @Res() res: Response) {
    try {
      const filePath = await this.reportService.getReportFilePathById(id);
      const file = fs.readFileSync(filePath);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline'); 
      res.send(file);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }


   // @UseGuards(JwtAuthGuard('admin'))
   @Get('download/:id')
   @ApiOperation({ description: 'Download report by ID' })
   @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
   @ApiResponse({ status: 200, description: 'Download PDF file' })
   async downloadReport(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    try {
      const filePath = await this.reportService.getReportFilePathById(id);
      return res.download(filePath);
    } catch (err) {
      return res.status(404).json({ message: err.message });
    }
  }

  // @UseGuards(JwtAuthGuard('admin'))
  @Get('Projectdashboard')
  @ApiOperation({ summary: 'Get summary statistics for all projects' })
  @ApiResponse({
    status: 200,
    description: 'project dashboard summary',
  })
  async getProjectDashboardSummary() {
    return this.reportService.getProjectDashboardSummary();
  }

    // @UseGuards(JwtAuthGuard('admin'))
    @Get('Contentdashboard')
    @ApiOperation({ summary: 'Get summary statistics for all contents' })
    @ApiResponse({
      status: 200,
      description: 'project dashboard summary',
    })
    async getContentDashboardSummary() {
      return this.reportService.getContentDashboardSummary();
    }
}
