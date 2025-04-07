import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from 'src/entities/project.entity';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [SequelizeModule.forFeature([Project])],
})
export class ProjectsModule {}
