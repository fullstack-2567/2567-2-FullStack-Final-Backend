import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { ContentMaps } from '../entities/content-maps.entity';
import { Project } from '../entities/project.entity';


@Module({
  imports: [SequelizeModule.forFeature([User, ContentMaps, Project])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}