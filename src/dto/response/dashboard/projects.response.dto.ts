import { ApiProperty } from '@nestjs/swagger';

export class ProjectCountDto {
  @ApiProperty({ description: 'Count from last month' })
  lastMonth: number;

  @ApiProperty({ description: 'Count from current month' })
  thisMonth: number;
}

export class ProjectSummaryDto {
  @ApiProperty({ type: () => ProjectCountDto })
  pending_projects: ProjectCountDto;

  @ApiProperty({ type: () => ProjectCountDto })
  total_projects: ProjectCountDto;

  @ApiProperty({ type: () => ProjectCountDto })
  rejected_projects: ProjectCountDto;
}

export class ProjectTypeDto {
  @ApiProperty({ description: 'Type of project' })
  type: string;

  @ApiProperty({ description: 'Number of projects of this type' })
  count: number;
}

export class ProjectStatusDto {
  @ApiProperty({ description: 'Number of projects pending first approval' })
  pending_first_approval: number;

  @ApiProperty({ description: 'Number of projects with first approval' })
  first_approved: number;

  @ApiProperty({ description: 'Number of projects with second approval' })
  second_approved: number;

  @ApiProperty({ description: 'Number of projects with third approval' })
  third_approved: number;

  @ApiProperty({ description: 'Number of rejected projects' })
  rejected: number;
}

export class SdgTypeDto {
  @ApiProperty({ description: 'SDG type' })
  sdg: string;

  @ApiProperty({ description: 'Number of projects with this SDG type' })
  count: number;
}

export class ChildProjectsDto {
  @ApiProperty({ description: 'Number of normal projects' })
  normal: number;

  @ApiProperty({ description: 'Number of child projects' })
  child: number;
}

export class ProjectsDashboardDataDto {
  @ApiProperty({ type: () => ProjectSummaryDto })
  summary: ProjectSummaryDto;

  @ApiProperty({ type: [ProjectTypeDto] })
  popular_project_types: ProjectTypeDto[];

  @ApiProperty({ type: () => ProjectStatusDto })
  project_status: ProjectStatusDto;

  @ApiProperty({ type: [SdgTypeDto] })
  popular_sdg_types: SdgTypeDto[];

  @ApiProperty({ type: () => ChildProjectsDto })
  child_projects: ChildProjectsDto;
}

export class ProjectsDashboardResponseDto {
  @ApiProperty({ description: 'Status of the response' })
  status: string;

  @ApiProperty({ type: () => ProjectsDashboardDataDto })
  data: ProjectsDashboardDataDto;
}
