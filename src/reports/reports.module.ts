import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { Content } from 'src/entities/content.entitiy';
import { Enrollment } from 'src/entities/enrollment.entity';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports: [SequelizeModule.forFeature([Project, User, Content, Enrollment])],
})
export class ReportsModule {}
