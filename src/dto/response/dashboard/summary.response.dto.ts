import { ApiProperty } from '@nestjs/swagger';

export class LoginCountDto {
  @ApiProperty({ description: 'Number of logins in the last month' })
  lastMonth: number;

  @ApiProperty({ description: 'Number of logins in the current month' })
  thisMonth: number;
}

export class EnrollCountDto {
  @ApiProperty({ description: 'Number of enrollments in the last month' })
  lastMonth: number;

  @ApiProperty({ description: 'Number of enrollments in the current month' })
  thisMonth: number;
}

export class DashboardSummaryDataDto {
  @ApiProperty({ type: () => LoginCountDto })
  loginCount: LoginCountDto;

  @ApiProperty({ type: () => EnrollCountDto })
  enrollCount: EnrollCountDto;
}

export class DashboardSummaryResponseDto {
  @ApiProperty({ description: 'Status of the response' })
  status: string;

  @ApiProperty({ type: () => DashboardSummaryDataDto })
  data: DashboardSummaryDataDto;
}
