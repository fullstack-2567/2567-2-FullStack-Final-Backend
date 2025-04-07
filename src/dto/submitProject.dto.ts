import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDate,
  ValidateIf,
} from 'class-validator';
import {
  EducationLevel,
  educationLevelsArray,
  UserPrefix,
  userPrefixesArray,
  UserSex,
  userSexesArray,
} from 'src/types/user.enum';
import {
  ProjectType,
  projectTypesArray,
  SDGType,
  sdgTypesArray,
} from 'src/types/projects.enum';

export class SubmitProjectDto {
  @ApiProperty({
    description: 'Thai name of the project',
    example: 'โครงการพัฒนาระบบจัดการข้อมูล',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  projectThaiName: string;

  @ApiProperty({
    description: 'English name of the project',
    example: 'Data Management System Development Project',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  projectEngName: string;

  @ApiProperty({
    description: 'Summary of the project',
    example: 'A comprehensive data management system development project',
    minLength: 1,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  projectSummary: string;

  @ApiProperty({
    description: 'Start date of the project',
    example: '2024-01-01',
    format: 'date',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: 'End date of the project',
    example: '2024-12-31',
    format: 'date',
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({
    description: 'SDG type of the project',
    enum: sdgTypesArray,
    example: 'SDG9',
  })
  @IsEnum(sdgTypesArray)
  sdgType: SDGType;

  @ApiProperty({
    description: 'Project description file as base64 encoded binary data',
    format: 'string',
    example: 'data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp...',
  })
  @IsString()
  @IsNotEmpty()
  projectDescriptionFile: string;

  @ApiProperty({
    description: 'Type of the project',
    enum: projectTypesArray,
    example: 'technology_and_innovation',
  })
  @IsEnum(projectTypesArray)
  projectType: ProjectType;

  @ValidateIf(
    (o) => o.parentProjectID !== null && o.parentProjectID !== undefined,
  )
  @ApiProperty({
    description: 'ID of the parent project',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  parentProjectID?: string | null;

  @ApiProperty({
    description:
      'User information for the project submitter, if there are not the data in the database yet, or if they want to update',
    required: false,
    type: () => ({
      prefix: {
        description: 'Title prefix of the user',
        enum: userPrefixesArray,
        example: 'mr',
      },
      sex: {
        description: 'Gender of the user',
        enum: userSexesArray,
        example: 'male',
      },
      educationLevel: {
        description: 'Education level of the user',
        enum: educationLevelsArray,
        example: 'bachelor',
      },
      firstName: {
        description: 'First name of the user',
        example: 'John',
        type: 'string',
      },
      lastName: {
        description: 'Last name of the user',
        example: 'Doe',
        type: 'string',
      },
      birthDate: {
        description: 'Birth date of the user',
        example: '1990-01-01',
        format: 'date',
        type: 'string',
      },
      tel: {
        description: 'Telephone number of the user',
        example: '0812345678',
        pattern: '^[0-9]{10}$',
        type: 'string',
      },
    }),
  })
  userInfo?: {
    prefix: UserPrefix;
    sex: UserSex;
    educationLevel: EducationLevel;
    firstName: string;
    lastName: string;
    birthDate: Date;
    tel: string;
  };
}
