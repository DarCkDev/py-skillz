import { PartialType } from '@nestjs/swagger';
import { FileCreateUploadDto } from './file-create-upload.dto';

export class FileUpdateUploadDto extends PartialType(FileCreateUploadDto) {}
