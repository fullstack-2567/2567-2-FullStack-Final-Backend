import { IsUUID, IsString, IsDateString, IsOptional } from 'class-validator';

export class UserProjectItemDto {
  @IsUUID()
  project_id: string;

  @IsString()
  project_name: string;

  @IsString()
  file_url: string;

  @IsDateString()
  submitted_at: string;

  @IsString()
  status: string;
}

export class UserProjectsDto {
  total: number;
  items: UserProjectItemDto[];
}