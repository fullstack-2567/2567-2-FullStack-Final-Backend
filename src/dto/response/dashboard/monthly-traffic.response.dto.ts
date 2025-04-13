import { ApiProperty } from '@nestjs/swagger';

export class DailyTrafficDto {
  @ApiProperty({ description: 'Day of the month' })
  day: number;

  @ApiProperty({ description: 'Number of logins for this day' })
  loginCount: number;

  @ApiProperty({ description: 'Number of enrollments for this day' })
  enrollmentCount: number;
}

export class MonthlyTrafficDataDto {
  @ApiProperty({ type: [DailyTrafficDto] })
  days: DailyTrafficDto[];
}

export class MonthlyTrafficResponseDto {
  @ApiProperty({ description: 'Status of the response' })
  status: string;

  @ApiProperty({ type: () => MonthlyTrafficDataDto })
  data: MonthlyTrafficDataDto;
}
