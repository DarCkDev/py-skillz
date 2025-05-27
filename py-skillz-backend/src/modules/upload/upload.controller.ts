import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { FileCreateUploadDto } from './dto/file-create-upload.dto';
import { multerStorage } from 'src/utils/multer-config';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Uploads')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: 'Subir archivos' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo a subir',
    type: FileCreateUploadDto,
  })
  @UseInterceptors(FileInterceptor('file', { storage: multerStorage }))
  async upload(
    @Body() dto: FileCreateUploadDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.uploadService.handleUpload(dto, file);
  }
}
