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
  
  @ApiTags('Users')
  @ApiBearerAuth()
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ 
        summary: 'Get all users with pagination',
        operationId: 'getAllUsers',
    })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    @ApiResponse({ status: 200, description: 'List of users' })
    async getAllUsers(@Query('page') page = '1', @Query('limit') limit = '10') {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      return this.usersService.findAllWithPagination(pageNum, limitNum);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get(':userId')
    @ApiOperation({ 
        summary: 'Get user by ID',
        operationId: 'getUserById',
    })
    @ApiParam({ name: 'userId', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User data' })
    @ApiResponse({ status: 404, description: 'User not found' })
    getUserById(@Param('userId') userId: string) {
      return this.usersService.findById(userId);
    }
  
    @UseGuards(JwtAuthGuard)
    @Patch(':userId')
    @ApiOperation({ 
        summary: 'Update your own user info',
        operationId: 'updateUserById', 
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
  
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    @Patch(':userId/role')
    @ApiOperation({ 
        summary: 'Update user role (admin only)',
        operationId: 'updateUserRole', 
    })
    @ApiParam({ name: 'userId', description: 'User ID' })
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            role: {
              type: 'string',
              enum: [...userRolesArray],
            },
          },
        },
      })
    @ApiResponse({ status: 200, description: 'User role updated' })
    @ApiResponse({ status: 403, description: 'Forbidden: Admin only' })
    updateUserRole(
      @Param('userId') userId: string,
      @Body('role') role: UserRole,
    ) {
      return this.usersService.updateRole(userId, role);
    }
  }
  