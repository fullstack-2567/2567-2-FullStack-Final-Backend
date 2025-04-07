import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUrl } from 'class-validator';

export class UpdateContentDto {
  @ApiProperty({ description: 'Content name' })
  @IsString()
  @IsOptional()
  contentName?: string;

  @ApiProperty({ description: 'Content category' })
  @IsString()
  @IsOptional()
  contentCategory?: string;

  @ApiProperty({ description: 'Content is public' })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
