import {
    IsEmail,
    IsDateString,
    IsString,
    IsOptional,
  } from 'class-validator';
  
  export class patchUserByIdDto {
    @IsEmail()
    @IsOptional()
    email: string;
  
    @IsString()
    @IsOptional()
    sex: string;
  
    @IsString()
    @IsOptional()
    firstName: string;
  
    @IsString()
    @IsOptional()
    lastName: string;
  
    @IsDateString()
    @IsOptional()
    birthDate: string;
  
    @IsString()
    @IsOptional()
    prefix: string;
  
    @IsString()
    @IsOptional()
    education: string;
  
    @IsString()
    @IsOptional()
    tel: string;
  }