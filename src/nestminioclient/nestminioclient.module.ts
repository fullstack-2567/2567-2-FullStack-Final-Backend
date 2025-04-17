import { Module } from '@nestjs/common';
import { NestMinioModule } from 'nestjs-minio';

// Usage in controller/services: constructor(@Inject(MINIO_CONNECTION) private readonly minioClient: Client) {}
// https://github.com/NestCrafts/nestjs-minio?tab=readme-ov-file#readme
@Module({
  imports: [
    NestMinioModule.registerAsync({
      useFactory: () => ({
        endPoint: process.env.MINIO_ENDPOINT ?? 'localhost',
        useSSL: process.env.MINIO_USE_SSL
          ? process.env.MINIO_USE_SSL === 'true'
          : false,
        accessKey: process.env.MINIO_ACCESS_KEY ?? 'minioadmin',
        secretKey: process.env.MINIO_SECRET_KEY ?? 'minioadmin',
      }),
    }),
  ],
})
export class NestMinioClientModule {}
