import { Module } from '@nestjs/common';
import { NestMinioModule } from 'nestjs-minio';

// Usage in controller/services: constructor(@Inject(MINIO_CONNECTION) private readonly minioClient: Client) {}
// https://github.com/NestCrafts/nestjs-minio?tab=readme-ov-file#readme
@Module({
  imports: [
    NestMinioModule.register({
      isGlobal: true,
      endPoint: process.env.MINIO_ENDPOINT ?? 'play.min.io',
      port: parseInt(process.env.MINIO_PORT ?? '9000'),
      useSSL: process.env.MINIO_USE_SSL
        ? process.env.MINIO_USE_SSL === 'true'
        : true,
      accessKey: process.env.MINIO_ACCESS_KEY ?? 'Q3AM3UQ867SPQQA43P2F',
      secretKey:
        process.env.MINIO_SECRET_KEY ??
        'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG',
    }),
  ],
})
export class NestMinioClientModule {}
