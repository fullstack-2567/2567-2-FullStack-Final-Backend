import { ApiProperty } from '@nestjs/swagger';

export class ContentsReportDto {
  @ApiProperty({
    description: 'The unique identifier of the content/course',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The title of the content/course',
    example: 'Introduction to Web Development',
  })
  title: string;

  @ApiProperty({
    description: 'Number of students enrolled in the course',
    example: 50,
  })
  studentsEnrolled: number;

  @ApiProperty({
    description: 'Number of students who have completed the course',
    example: 30,
  })
  studentsCompleted: number;
}
