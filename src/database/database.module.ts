import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { Report } from 'src/entities/report.entity';
import { ContentMap } from 'src/entities/content-map.entity';
import { Content } from 'src/entities/content.entity';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: 'postgres',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT ?? '4527'),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        models: [User, Project, Report, ContentMap, Content],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
