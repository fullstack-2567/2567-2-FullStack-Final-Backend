import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsDateString,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import {
  EducationLevel,
  educationLevelsArray,
  UserPrefix,
  userPrefixesArray,
  UserSex,
  userSexesArray,
} from 'src/types/user.enum';

export class patchUserByIdDto {
  @IsEnum(userSexesArray)
  @IsOptional()
  @ApiProperty({
    description: 'Gender of the user',
    enum: userSexesArray,
    example: 'male',
    required: false,
  })
  sex: UserSex;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    type: 'string',
    required: false,
  })
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'First name of the user',
    example: 'Doe',
    type: 'string',
    required: false,
  })
  lastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Birthdate of the user',
    example: 'John',
    type: 'string',
    required: false,
  })
  birthDate: string;

  @IsEnum(userPrefixesArray)
  @IsOptional()
  @ApiProperty({
    description: 'Title prefix of the user',
    enum: userPrefixesArray,
    example: 'mr',
    required: false,
  })
  prefix: UserPrefix;

  @IsEnum(educationLevelsArray)
  @IsOptional()
  @ApiProperty({
    description: 'Education level of the user',
    enum: educationLevelsArray,
    example: 'bachelor',
    required: false,
  })
  education: EducationLevel;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Telephone number of the user',
    example: '0812345678',
    pattern: '^[0-9]{10}$',
    required: false,
  })
  tel: string;
}