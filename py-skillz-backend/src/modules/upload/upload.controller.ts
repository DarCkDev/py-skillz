import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { FileCreateUploadDto } from './dto/file-create-upload.dto';
import { multerStorage } from 'src/utils/multer-config';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auht.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../user/entities/role.entity';

@ApiTags('Uploads')
@ApiBearerAuth('access_token')
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
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  @UseInterceptors(FileInterceptor('file', { storage: multerStorage }))
  async upload(
    @Body() dto: FileCreateUploadDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.uploadService.handleUpload(dto, file);
  }
}
