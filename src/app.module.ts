import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { NestMinioClientModule } from './nestminioclient/nestminioclient.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    NestMinioClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
