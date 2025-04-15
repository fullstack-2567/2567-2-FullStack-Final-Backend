import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserRole, userRolesArray } from 'src/types/user.enum';

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'New role for the user',
    enum: userRolesArray,
    example: 'admin',
  })
  @IsEnum(userRolesArray)
  role: UserRole;
}
