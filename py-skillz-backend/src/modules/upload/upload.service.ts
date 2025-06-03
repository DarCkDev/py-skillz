import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'node:fs';
import { FileType } from './upload.filetype';
import { FileCreateUploadDto } from './dto/file-create-upload.dto';
import { UploadResult } from './dto/upload-result';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';
import { Repository } from 'typeorm';
import { Source } from './entities/source.entity';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
    private readonly i18n: I18nService,
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

    if (!file)
      throw new BadRequestException({
        statusCode: 400,
        message: [
          this.i18n.t('upload.invalidFile', {
            lang: I18nContext.current()?.lang,
          }),
        ],
        error: 'Bad Request',
      });

    const mimeValid = this.validateMimeType(dto.type, file.mimetype);
    if (!mimeValid) {
      await fs.promises.unlink(file.path);
      throw new BadRequestException({
        statusCode: 400,
        message: [
          this.i18n.t('upload.invalidMimeType', {
            lang: I18nContext.current()?.lang,
          }),
        ],
        error: 'Bad Request',
      });
    }

    const filePath = file.path.replace('public/', '').replace(/\\/g, '/');

    const entity = this.uploadRepository.create({
      url: filePath,
      source: Source.UPLOAD,
      type: dto.type,
      name: file.originalname,
    });

    const saved = await this.uploadRepository.save(entity);

    return { ...saved };
  }

  async getOne(id: string): Promise<Upload> {
    if (!this.isUUID(id)) {
      throw new BadRequestException({
        statusCode: 400,
        message: [
          this.i18n.t('upload.invalidId', {
            lang: I18nContext.current()?.lang,
          }),
        ],
        error: 'Bad Request',
      });
    }
    const upload = await this.uploadRepository.findOne({ where: { id } });

    if (!upload) {
      throw new NotFoundException({
        statusCode: 404,
        message: [
          this.i18n.t('upload.fileNotFound', {
            lang: I18nContext.current()?.lang,
          }),
        ],
        error: 'Not Found',
      });
    }
    return upload;
  }

  async delete(id: string): Promise<void> {
    if (!this.isUUID(id)) {
      throw new BadRequestException({
        statusCode: 400,
        message: [
          this.i18n.t('upload.invalidId', {
            lang: I18nContext.current()?.lang,
          }),
        ],
        error: 'Bad Request',
      });
    }
    const upload = await this.uploadRepository.findOne({ where: { id } });
    if (!upload)
      throw new NotFoundException({
        statusCode: 404,
        message: [
          this.i18n.t('upload.fileNotFound', {
            lang: I18nContext.current()?.lang,
          }),
        ],
        error: 'Not Found',
      });

    if (upload.source === Source.UPLOAD) {
      try {
        await fs.promises.unlink(upload.url);
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw new InternalServerErrorException({
            statusCode: 500,
            message: [
              this.i18n.t('upload.errorDeletingFile', {
                lang: I18nContext.current()?.lang,
              }),
            ],
            error: 'Internal Server Error',
          });
        }
      }
    }

    await this.uploadRepository.delete(id);
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

  private isUUID(uuid: string): boolean {
    const regexExp =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/gi;
    return regexExp.test(uuid);
  }
}
