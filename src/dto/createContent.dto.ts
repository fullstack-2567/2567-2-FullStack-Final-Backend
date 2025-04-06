import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsUrl } from 'class-validator';

export class CreateContentDto {
  @ApiProperty({ description: 'Content name' })
  @IsString()
  contentName: string;

  @ApiProperty({ description: 'Content thumbnail (S3 Link)' })
  @IsUrl()
  contentThumbnail: string;

  @ApiProperty({ description: 'Content video link (S3 Link)' })
  @IsUrl()
  contentVideoLink: string;

  @ApiProperty({ description: 'Content category' })
  @IsString()
  contentCategory: string;

  @ApiProperty({ description: 'Content description' })
  @IsString()
  contentDescription: string;

  @ApiProperty({ description: 'Is content public' })
  @IsBoolean()
  is_public: boolean;

  // Optional property to store video duration
  @ApiProperty({ description: 'Video duration (in seconds)', required: false })
  video_duration?: number;
}
