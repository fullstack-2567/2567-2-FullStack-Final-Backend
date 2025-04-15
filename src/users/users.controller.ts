import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { patchUserByIdDto } from './dto/patchUserById.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { UserRole, userRolesArray } from 'src/types/user.enum';
import { Public } from 'src/auth/decorators/public.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateUserRoleDto } from './dto/updateUserRole.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':userId/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({
    operationId: 'patchUserRole',
    summary: 'Update user role (admin only)',
    description: 'Allows admin to update the role of any user.',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden: Admins only' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  updateUserRole(
    @Param('userId') userId: string,
    @Body() body: UpdateUserRoleDto,
  ) {
    return this.usersService.updateRole(userId, body.role);
  }

  @Public()
  @ApiOperation({
    operationId: 'getUserRoles',
    description: 'Get all available user roles',
  })
  @Get('roles')
  @ApiOperation({ summary: 'Get all available user roles' })
  @ApiResponse({ status: 200, description: 'List of user roles' })
  getUserRoles() {
    return this.usersService.getAvailableRoles();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiOperation({
    operationId: 'getAllUsers',
    description: 'Get all users with pagination, search and role filter',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: 'kaew' })
  @ApiQuery({ name: 'role', required: false, example: 'user' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async getAllUsers(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return this.usersService.findAllWithPagination(
      pageNum,
      limitNum,
      search,
      role,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':userId')
  @ApiOperation({
    operationId: 'getUserById',
    description: 'Get user by ID',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User data' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserById(@Param('userId') userId: string) {
    return this.usersService.findById(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @Patch(':userId')
  @ApiOperation({
    operationId: 'updateUserById',
    description: 'Update your own user info',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiBody({ type: patchUserByIdDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden: Cannot update others' })
  updateUserById(
    @Param('userId') userId: string,
    @Body() updateData: patchUserByIdDto,
    @Req() req: any,
  ) {
    if (req.user.id !== userId) {
      throw new ForbiddenException('You can only update your own data');
    }
    return this.usersService.updateUserById(userId, updateData);
  }
}
