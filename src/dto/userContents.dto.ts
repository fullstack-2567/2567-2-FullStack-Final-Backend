import { IsUUID, IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class UserContentItemDto {
  @IsUUID()
  content_id: string;

  @IsString()
  content_name: string;

  @IsString()
  content_description: string;

  @IsString()
  content_thumbnail: string;

  @IsDateString()
  enrolled_at: string;

  @IsOptional()
  @IsDateString()
  completed_at?: string;

  @IsNumber()
  progress_percentage: number;
}

export class UserContentsDto {
  total: number;
  items: UserContentItemDto[];
}