import { Module, OnModuleInit } from '@nestjs/common';
import { S3Service } from './s3.service';
import { MinioRunnerService } from './minio-runner.service';

@Module({
  providers: [S3Service, MinioRunnerService],
})
export class S3Module implements OnModuleInit {
  constructor(private readonly minioRunnerService: MinioRunnerService) {}

  onModuleInit() {
    this.minioRunnerService.startMinioContainer().catch((err) => {
      console.error('Error al iniciar MinIO:', err);
    });
  }
}
