import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';


import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}