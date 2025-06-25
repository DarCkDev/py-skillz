import { Injectable, Logger } from '@nestjs/common';
import { execSync, spawn } from 'child_process';
import {
  S3Client,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class MinioRunnerService {
  private readonly logger = new Logger(MinioRunnerService.name);
  private readonly containerName = 'minio';

  async startMinioContainer() {
    if (this.isMinioRunning()) {
      this.logger.log('MinIO ya está corriendo.');
      return;
    }

    await this.startContainer();
    await this.waitForMinioReady();
    await this.setupBucketAndPolicyWithSDK();
  }

  private async startContainer(): Promise<void> {
    return new Promise((resolve, reject) => {
      const args = [
        'run',
        '-d',
        '--name',
        'minio',
        '-p',
        '9000:9000',
        '-p',
        '9001:9001',
        '-e',
        'MINIO_ROOT_USER=minio',
        '-e',
        'MINIO_ROOT_PASSWORD=minio123',
        '-v',
        'minio_data:/data',
        'minio/minio',
        'server',
        '/data',
        '--console-address',
        ':9001',
      ];

      const docker = spawn('docker', args, { shell: true });

      docker.on('close', (code) => {
        if (code === 0) {
          this.logger.log('Contenedor MinIO iniciado correctamente.');
          resolve();
        } else {
          this.logger.error(`Error iniciando MinIO (code ${code})`);
          reject(new Error(`Docker exited with code ${code}`));
        }
      });

      docker.on('error', (err) => {
        this.logger.error('Error al ejecutar Docker', err);
        reject(err);
      });
    });
  }

  private async waitForMinioReady(): Promise<void> {
    this.logger.log('Esperando a que MinIO esté listo...');

    const maxRetries = 30;
    let retries = 0;

    const s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: 'http://localhost:9000',
      credentials: {
        accessKeyId: 'minio',
        secretAccessKey: 'minio123',
      },
      forcePathStyle: true,
    });

    while (retries < maxRetries) {
      try {
        await s3Client.send(
          new HeadBucketCommand({ Bucket: 'test-connection' }),
        );
        this.logger.log('MinIO está listo.');
        return;
      } catch (error) {
        const err = error as Error;
        if (err.name === 'NotFound' || err.name === 'NoSuchBucket') {
          this.logger.log('MinIO está listo.');
          return;
        }
      }

      await this.sleep(1000);
      retries++;
    }

    throw new Error('MinIO no estuvo listo después de 30 segundos');
  }

  private async setupBucketAndPolicyWithSDK(): Promise<void> {
    const s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: 'http://localhost:9000',
      credentials: {
        accessKeyId: 'minio',
        secretAccessKey: 'minio123',
      },
      forcePathStyle: true,
    });

    try {
      // Crear bucket
      try {
        await s3Client.send(new CreateBucketCommand({ Bucket: 'uploads' }));
        this.logger.log('Bucket "uploads" creado exitosamente.');
      } catch (error) {
        const err = error as Error;
        if (
          err.name === 'BucketAlreadyOwnedByYou' ||
          err.name === 'BucketAlreadyExists'
        ) {
          this.logger.log('El bucket "uploads" ya existe.');
        } else {
          throw error;
        }
      }

      // Configurar política pública
      const bucketPolicy = {
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'PublicReadGetObject',
            Effect: 'Allow',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: 'arn:aws:s3:::uploads/*',
          },
        ],
      };

      await s3Client.send(
        new PutBucketPolicyCommand({
          Bucket: 'uploads',
          Policy: JSON.stringify(bucketPolicy),
        }),
      );

      this.logger.log(
        'MinIO configurado completamente. Bucket "uploads" listo para uso público.',
      );
    } catch (error) {
      this.logger.error('Error configurando bucket y políticas:', error);
      throw error;
    }
  }

  private isMinioRunning(): boolean {
    try {
      const output = execSync(
        `docker ps --filter "name=${this.containerName}" --filter "status=running" --format "{{.Names}}"`,
        { encoding: 'utf-8' },
      );
      return output.trim() === this.containerName;
    } catch (error) {
      this.logger.error('Error verificando si MinIO está corriendo', error);
      return false;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
