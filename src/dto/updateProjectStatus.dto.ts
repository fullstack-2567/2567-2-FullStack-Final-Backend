import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import {
  ProjectUpdateAction,
  projectUpdateActionsArray,
<<<<<<< HEAD
} from 'src/types/enums';
=======
} from 'src/types/projects.enum';
>>>>>>> main

export class UpdateProjectStatusDto {
  @ApiProperty({
    description: 'Action to perform on the project',
    type: 'string',
    enum: projectUpdateActionsArray,
    example: 'approve',
  })
  @IsEnum(projectUpdateActionsArray)
  action: ProjectUpdateAction;
<<<<<<< HEAD
=======

  @ApiProperty({
    description: 'User ID of the approver performing the action',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  approverId: string;
>>>>>>> main
}
