import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { contentCategoriesArray, ContentCategory } from 'src/types/enums';

export class CreateContentDto {
  @ApiProperty({ description: 'Content name' })
  @IsString()
  @IsNotEmpty()
  contentName: string;

  @ApiProperty({ description: 'Content thumbnail (base64)' })
  @IsString()
  @IsNotEmpty()
  contentThumbnail: string;

  @ApiProperty({ description: 'Content video link (base64)' })
  @IsString()
  @IsNotEmpty()
  contentVideo: string;

  @ApiProperty({
    description: 'Content category',
    enum: contentCategoriesArray,
  })
  @IsEnum(contentCategoriesArray)
  contentCategory: ContentCategory;

  @ApiProperty({ description: 'Content description' })
  @IsString()
  @IsNotEmpty()
  contentDescription: string;

  @ApiProperty({ description: 'Is content public' })
  @IsBoolean()
  @IsNotEmpty()
  is_public: boolean;

  // Optional property to store video duration
  @ApiProperty({ description: 'Video duration (in seconds)', required: false })
  video_duration?: number;
}
