import { IsUUID, IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class UserFileItemDto {
  @IsUUID()
  file_id: string;

  @IsString()
  file_name: string;

  @IsString()
  file_url: string;

  @IsNumber()
  file_size: number;

  @IsString()
  file_type: string;

  @IsDateString()
  created_at: string;
}

export class UserFilesDto {
  total: number;
  items: UserFileItemDto[];
}