import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { urlencoded, json } from 'express';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  const configService = app.get(ConfigService);
  const jwtAuthGuard = app.get(JwtAuthGuard);

  const contextPath = configService.get('CONTEXT_PATH');
  app.setGlobalPrefix(contextPath ?? '');
  app.useGlobalGuards(jwtAuthGuard);

  // request entity
  app.use(json({ limit: '500mb' }));
  app.use(urlencoded({ extended: true, limit: '500mb' }));

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addTag('projects', 'Project management endpoints')
    .addServer(configService.get('SERVER_URL') ?? '')
    .addCookieAuth(
      'access_token',
      {
        type: 'apiKey',
        in: 'cookie',
        name: 'access_token',
        description: 'Enter Access Token',
      },
      'access_token',
    )
    .addCookieAuth(
      'refresh_token',
      {
        type: 'apiKey',
        description: 'Enter Refresh Token',
        in: 'cookie',
        name: 'refresh_token',
      },
      'refresh_token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: '/openapi.json',
  });

  app.use(
    `${contextPath}/reference`,
    apiReference({
      content: () => document,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
