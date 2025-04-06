import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUrl } from 'class-validator';

export class UpdateContentDto {
  @ApiProperty({ description: 'Content name' })
  @IsString()
  @IsOptional()
  content_name?: string;

  @ApiProperty({ description: 'Content thumbnail (S3 Link)' })
  @IsUrl()
  @IsOptional()
  content_thumbnail?: string;

  @ApiProperty({ description: 'Content video link (S3 Link)' })
  @IsUrl()
  @IsOptional()
  content_video_link?: string;

  @ApiProperty({ description: 'Content category' })
  @IsString()
  @IsOptional()
  content_category?: string;

  @ApiProperty({ description: 'Content is public' })
  @IsBoolean()
  @IsOptional()
  is_public?: boolean;
}
