import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'node:fs';
import { FileType } from './upload.filetype';
import { FileCreateUploadDto } from './dto/file-create-upload.dto';
import { UploadResult } from './dto/upload-result';

@Injectable()
export class UploadService {
  async handleUpload(
    dto: FileCreateUploadDto,
    file?: Express.Multer.File,
  ): Promise<UploadResult> {
    if (dto.externalUrl) {
      return { url: dto.externalUrl, source: 'external' };
    }

    if (!file) throw new BadRequestException('No file provided');

    const mimeValid = this.validateMimeType(dto.type, file.mimetype);
    if (!mimeValid) {
      await fs.promises.unlink(file.path);
      throw new BadRequestException(`Invalid mime type ${dto.type}`);
    }

    return { url: file.path.replace('public/', ''), source: 'upload' };
  }

  private validateMimeType(type: FileType, mimetype: string): boolean {
    const mimeMap = {
      [FileType.VIDEO]: ['video/mp4', 'video/webm', 'video/quicktime'],
      [FileType.DOCUMENT]: ['application/pdf'],
      [FileType.PRESENTATION]: [
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ],
    };
    return mimeMap[type]?.includes(mimetype) ?? false;
  }
}
