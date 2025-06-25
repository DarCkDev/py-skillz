import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { FileType } from 'src/modules/upload/upload.filetype';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName = 'uploads';

  constructor() {
    this.s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: process.env.AWS_ENDPOINT || 'http://localhost:9000',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'minio',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'minio123',
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(file: Express.Multer.File, type: FileType): Promise<string> {
    const cleanFileName = path.basename(file.filename);
    const key = `${type}/${cleanFileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: fs.createReadStream(file.path),
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    await fs.promises.unlink(file.path);

    return key;
  }

  async deleteFileResponse(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    await this.s3Client.send(command);
  }

  getPublicUrl(key: string): string {
    return `http://localhost:9000/${this.bucketName}/${key}`;
  }
}
