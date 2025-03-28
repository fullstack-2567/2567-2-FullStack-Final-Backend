import { Injectable, OnModuleInit } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly sequelize: Sequelize) {}

  async onModuleInit() {
    // Sync all models with the database and alter the table
    await this.sequelize.sync({ alter: true });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
