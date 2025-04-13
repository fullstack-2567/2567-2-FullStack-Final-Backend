import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SystemLog } from 'src/entities/systemLog.entity';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(SystemLog)
    private systemLogRepository: typeof SystemLog,
  ) {}

  async login(userId: string) {
    const log = await this.systemLogRepository.create({
      userId: userId,
    });
    return log;
  }
}
