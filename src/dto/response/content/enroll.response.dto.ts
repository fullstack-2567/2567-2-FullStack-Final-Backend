import { ApiProperty } from '@nestjs/swagger';

export class EnrollResponseDataDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @ApiProperty({ example: '987e6543-a21c-43d3-a999-426614174999' })
  contentId: string;

  @ApiProperty({ example: '2025-04-01T10:00:00Z' })
  enrolledDT: Date;

  @ApiProperty({ example: null })
  completedDT?: Date;
}

export class EnrollResponseDto {
  @ApiProperty({ description: 'Status of the response', example: 'success' })
  status: string;

  @ApiProperty({
    type: EnrollResponseDataDto,
  })
  data: EnrollResponseDataDto;
}
