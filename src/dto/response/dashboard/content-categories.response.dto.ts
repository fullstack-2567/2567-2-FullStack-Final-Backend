import { ApiProperty } from '@nestjs/swagger';

export class ContentCategoryDto {
  @ApiProperty({ description: 'Name of the content category' })
  category: string;

  @ApiProperty({ description: 'Number of contents in this category' })
  contentCount: number;
}

export class ContentCategoriesDataDto {
  @ApiProperty({ type: [ContentCategoryDto] })
  categories: ContentCategoryDto[];
}

export class ContentCategoriesResponseDto {
  @ApiProperty({ description: 'Status of the response' })
  status: string;

  @ApiProperty({ type: () => ContentCategoriesDataDto })
  data: ContentCategoriesDataDto;
}
