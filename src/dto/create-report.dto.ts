import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ReportType, reportTypeArray } from 'src/types/enums';

export class CreateReportDto {
  @ApiProperty({
    description: 'Type of report to generate',
    enum: reportTypeArray,
    example: ReportType.PROJECT,
  })
  @IsEnum(ReportType)
  report_type: ReportType;

  @ApiProperty({
    description: 'Name of the report file',
    example: 'project_report_2025-04-06.pdf',
    required: false,
  })
  @IsString()
  @IsOptional()
  fileName?: string;

  // ถ้าใช้ jwt อย่าลืมลบออก
  @ApiProperty({
    description: 'Admin user ID who generated the report',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  adminUserId?: string;

  @ApiProperty({
    description: 'HTML content for the report (sent from frontend)',
    example: '<html><body><h1>My Report</h1></body></html>',
  })
  @IsString()
  @IsOptional()
  html?: string;

  @ApiProperty({
    description: 'Whether the report is focused on users',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isUserReport: boolean;
}
