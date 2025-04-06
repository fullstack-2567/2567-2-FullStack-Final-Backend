import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Report } from '../entities/report.entity';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { ContentMap } from 'src/entities/content-map.entity';
import { Content } from 'src/entities/content.entity';


@Module({
  imports: [SequelizeModule.forFeature([Report, Project, User, ContentMap, Content])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
