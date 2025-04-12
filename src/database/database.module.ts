import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Content } from 'src/entities/content.entitiy';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { UserContentMaps } from 'src/entities/userContentMaps.entity';

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
        models: [User, Project, Content, UserContentMaps],
        synchronize: true, // don't have to create table by yourself *DON'T use in production*
      }),
    }),
  ],
})
export class DatabaseModule {}
