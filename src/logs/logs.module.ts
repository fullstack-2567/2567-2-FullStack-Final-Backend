import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { SystemLog } from 'src/entities/systemLog.entity';

@Module({
  imports: [SequelizeModule.forFeature([SystemLog])],
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {}
