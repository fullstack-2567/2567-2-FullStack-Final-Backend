import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { Content } from 'src/entities/content.entitiy';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserContentReport } from 'src/entities/userContentMaps';

@Module({
  controllers: [ContentController],
  providers: [ContentService],
  imports: [SequelizeModule.forFeature([Content, UserContentReport])],
})
export class ContentModule {}
