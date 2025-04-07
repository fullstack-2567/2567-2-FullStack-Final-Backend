import { IsUUID, IsString, IsEmail, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class UserDto {
  @IsUUID()
  user_id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  sex?: string;

  @IsOptional()
  @IsDateString()
  birthdate?: Date;

  @IsDateString()
  created_at: string;

  @IsDateString()
  updated_at: string;

  @IsString()
  roles: string;

  @IsBoolean()
  active: boolean;
}