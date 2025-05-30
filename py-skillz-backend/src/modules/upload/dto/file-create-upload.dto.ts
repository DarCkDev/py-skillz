import { IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { FileType } from '../upload.filetype';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FileCreateUploadDto {
  @ApiProperty({ enum: FileType, description: 'Tipo de archivo' })
  @IsEnum(FileType)
  type: FileType;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Url del archivo',
  })
  @ValidateIf((o: FileCreateUploadDto) => !o.externalUrl)
  file?: any;

  @ApiPropertyOptional({ description: 'Url externa' })
  @ValidateIf((o: FileCreateUploadDto) => !o.file)
  @IsString()
  @IsOptional()
  externalUrl?: string;
}
