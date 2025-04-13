import { ApiProperty } from '@nestjs/swagger';

export class ProjectCountDto {
  @ApiProperty({ description: 'Count from last month' })
  lastMonth: number;

  @ApiProperty({ description: 'Count from current month' })
  thisMonth: number;
}

export class ProjectTypeCountDto {
  @ApiProperty({ description: 'Type of project' })
  type: string;

  @ApiProperty({ description: 'Number of projects of this type' })
  count: number;
}

export class ProjectsDashboardDataDto {
  @ApiProperty({ type: () => ProjectCountDto })
  pending_projects: ProjectCountDto;

  @ApiProperty({ type: () => ProjectCountDto })
  total_projects: ProjectCountDto;

  @ApiProperty({ type: () => ProjectCountDto })
  rejected_projects: ProjectCountDto;

  @ApiProperty({ type: [ProjectTypeCountDto] })
  project_types: ProjectTypeCountDto[];
}

export class ProjectsDashboardResponseDto {
  @ApiProperty({ description: 'Status of the response' })
  status: string;

  @ApiProperty({ type: () => ProjectsDashboardDataDto })
  data: ProjectsDashboardDataDto;
}
