import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'node:fs';
import { FileType } from './upload.filetype';
import { FileCreateUploadDto } from './dto/file-create-upload.dto';
import { UploadResult } from './dto/upload-result';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';
import { Repository } from 'typeorm';
import { Source } from './entities/source.entity';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
  ) {}

  async handleUpload(
    dto: FileCreateUploadDto,
    file?: Express.Multer.File,
  ): Promise<UploadResult> {
    if (dto.externalUrl) {
      const entity = this.uploadRepository.create({
        url: dto.externalUrl,
        source: Source.EXTERNAL,
        type: dto.type,
        name: dto.externalUrl.split('/').pop(),
      });
      const saved = await this.uploadRepository.save(entity);
      return { ...saved };
    }

    if (!file) throw new BadRequestException('No file provided');

    const mimeValid = this.validateMimeType(dto.type, file.mimetype);
    if (!mimeValid) {
      await fs.promises.unlink(file.path);
      throw new BadRequestException(`Invalid mime type ${dto.type}`);
    }

    const filePath = file.path.replace('public/', '');

    const entity = this.uploadRepository.create({
      url: filePath,
      source: Source.UPLOAD,
      type: dto.type,
      name: file.originalname,
    });

    const saved = await this.uploadRepository.save(entity);

    return { ...saved };
  }

  private validateMimeType(type: FileType, mimetype: string): boolean {
    const mimeMap = {
      [FileType.VIDEO]: ['video/mp4', 'video/webm', 'video/quicktime'],
      [FileType.DOCUMENT]: ['application/pdf'],
      [FileType.IMAGE]: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/tiff',
      ],
      [FileType.PRESENTATION]: [
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ],
    };
    return mimeMap[type]?.includes(mimetype) ?? false;
  }
}
