import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { patchUserByIdDto } from '../dto/patchUserById.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get(':userId')
  async getUserById(@Param('userId') userId: string) {
    try {
      return await this.usersService.getUserById(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }

  @Patch(':userId')
  async updateUserById(
    @Param('userId') userId: string,
    @Body() updateData: patchUserByIdDto,
  ) {
    try {
      return await this.usersService.updateUserById(userId, updateData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }

  @Get(':userId/progress')
  async getUserProgress(@Param('userId') userId: string): Promise<any> {
    try {
      return await this.usersService.getUserProgress(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }
}
