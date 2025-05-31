import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Param,
  Delete,
  Get,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { FileCreateUploadDto } from './dto/file-create-upload.dto';
import { multerStorage } from 'src/utils/multer-config';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiParam,
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
  @ApiHeader({
    name: 'x-custom-lang',
    description: 'Language response: es|ay|qu|gn',
    required: false,
  })
  @ApiOperation({ summary: 'Subir archivos' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload file',
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

  @Get(':id')
  @HttpCode(200)
  @ApiHeader({
    name: 'x-custom-lang',
    description: 'Language response: es|ay|qu|gn',
    required: false,
  })
  @ApiOperation({ summary: 'Get file' })
  @ApiParam({ name: 'id', description: 'File id', required: true })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  async getOne(@Param('id') id: string) {
    return await this.uploadService.getOne(id);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiHeader({
    name: 'x-custom-lang',
    description: 'Language response: es|ay|qu|gn',
    required: false,
  })
  @ApiOperation({ summary: 'Delete file' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  async delete(@Param('id') id: string) {
    await this.uploadService.delete(id);
  }
}
