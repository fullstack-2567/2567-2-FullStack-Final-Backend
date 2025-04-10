import { ApiProperty } from '@nestjs/swagger';

export class UsersReportDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Total number of courses the user has enrolled in',
    example: 5,
  })
  coursesTaken: number;

  @ApiProperty({
    description: 'Number of courses the user has completed',
    example: 3,
  })
  coursesCompleted: number;
}
