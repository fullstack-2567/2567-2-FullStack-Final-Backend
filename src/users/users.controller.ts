import { Controller, Get, Param, Put, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from '../auth/enums/roles.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Route accessible only to admins
  @Get()
  @Roles(UserRole.ADMIN)
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map(user => {
      const { refreshToken, ...result } = user.toJSON() as any;
      return result;
    });
  }

  @Get('test')
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.USER) 
  getTest() {
    return { message: 'This is a test route' };
  }

  // Public route example (no authentication required)
  @Get('public-info')
  @Public()
  getPublicInfo() {
    return { message: 'This is public information about the user system' };
  }

  // Route accessible to both admins and moderators
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PROJECT_APPROVER)
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    const { refreshToken, ...result } = user.toJSON() as any;
    return result;
  }

  // Route accessible only to admins for changing user roles
  @Put(':id/role')
  @Roles(UserRole.ADMIN)
  async updateRole(@Param('id') id: string, @Body('role') role: UserRole) {
    const user = await this.usersService.updateRole(id, role);
    const { refreshToken, ...result } = user.toJSON() as any;
    return result;
  }
}