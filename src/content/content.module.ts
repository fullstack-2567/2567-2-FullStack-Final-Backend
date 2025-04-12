import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { Content } from 'src/entities/content.entitiy';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserContentMaps } from 'src/entities/userContentMaps.entity';

@Module({
  controllers: [ContentController],
  providers: [ContentService],
  imports: [SequelizeModule.forFeature([Content, UserContentMaps])],
})
export class ContentModule {}
