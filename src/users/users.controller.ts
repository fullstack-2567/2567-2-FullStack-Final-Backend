import { Body, Controller, Get, NotFoundException, Param, Patch, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { patchUserByIdDto } from '../dto/patchUserById.dto';
import { UpdateUserStatusDto } from 'src/dto/userStatus.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ): Promise<any> {
    return this.usersService.getAllUsers(Number(limit), Number(offset), search, role);
  }

  @Get(':user_id')
  async getUserById(@Param('user_id') userId: string): Promise<any> {
    try {
      return await this.usersService.getUserById(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }

  @Patch(':user_id')
  async updateUserById(
    @Param('user_id') userId: string,
    @Body() updateData: patchUserByIdDto,
  ): Promise<any> {
    try {
      return await this.usersService.updateUserById(userId, updateData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }

  @Get(':user_id/progress')
  async getUserProgress(@Param('user_id') userId: string): Promise<any> {
    try {
      return await this.usersService.getUserProgress(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }

  @Get(':user_id/projects')
  async getUserProjects(
    @Param('user_id') userId: string,
    @Query('status') status?: string,
  ): Promise<any> {
    try {
      return await this.usersService.getUserProjects(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }

  @Get(':user_id/contents')
  async getUserContents(
    @Param('user_id') userId: string,
    @Query('status') status?: string,
  ): Promise<any> {
    try {
      return await this.usersService.getUserContents(userId, status);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  @Patch(':user_id/status')
  @UsePipes(new ValidationPipe())
  async updateUserStatus(
    @Param('user_id') userId: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ): Promise<any> {
    try {
      return await this.usersService.updateUserStatus(userId, updateUserStatusDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  @Get(':user_id/files')
  async getUserFiles(
    @Param('user_id') userId: string,
    @Query('type') type?: string,
  ): Promise<any> {
    try {
      return await this.usersService.getUserFiles(userId, type);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }
}