import { ApiProperty } from '@nestjs/swagger';

export class PopularContentDto {
  @ApiProperty({ description: 'Unique identifier of the content' })
  contentId: string;

  @ApiProperty({ description: 'Name of the content' })
  contentName: string;

  @ApiProperty({ description: 'Number of enrollments for this content' })
  enrollmentCount: number;
}

export class PopularContentsDataDto {
  @ApiProperty({ type: [PopularContentDto] })
  courses: PopularContentDto[];
}

export class PopularContentsResponseDto {
  @ApiProperty({ description: 'Status of the response' })
  status: string;

  @ApiProperty({ type: () => PopularContentsDataDto })
  data: PopularContentsDataDto;
}
