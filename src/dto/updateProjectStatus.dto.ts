import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import {
  ProjectUpdateAction,
  projectUpdateActionsArray,
} from 'src/types/projects.enum';

export class UpdateProjectStatusDto {
  @ApiProperty({
    description: 'Action to perform on the project',
    type: 'string',
    enum: projectUpdateActionsArray,
    example: 'approve',
  })
  @IsEnum(projectUpdateActionsArray)
  action: ProjectUpdateAction;
}
