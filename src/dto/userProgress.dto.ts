import { IsUUID, IsString, IsNumber, IsDateString, IsBoolean } from 'class-validator';

export class UserProgressItemDto {
  @IsUUID()
  content_id: string;

  @IsString()
  content_name: string;

  @IsNumber()
  progress_percentage: number;

  @IsNumber()
  current_position: number;

  @IsDateString()
  last_accessed: string;

  @IsBoolean()
  completed: boolean;
}

export class UserProgressDto {
  @IsNumber()
  total_contents: number;

  @IsNumber()
  completed_contents: number;

  @IsNumber()
  in_progress_contents: number;

  @IsNumber()
  average_progress: number;

  items: UserProgressItemDto[];
}