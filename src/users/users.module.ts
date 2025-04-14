import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';


import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';
import { UsersController } from './users.controller';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}