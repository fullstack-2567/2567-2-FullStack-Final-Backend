import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { Content } from 'src/entities/content.entitiy';
import { UserContentMaps } from 'src/entities/userContentMaps.entity';
import { SystemLog } from 'src/entities/systemLog.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Project,
      User,
      Content,
      UserContentMaps,
      SystemLog,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
