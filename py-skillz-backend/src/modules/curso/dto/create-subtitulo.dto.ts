import {
  IsString, IsNumber, IsOptional, IsArray, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEjercicioDto } from './create-ejercicio.dto';

export class CreateSubtituloDto {
  @IsString() tituloSubtitulo: string;
  @IsString() textoEnriquecido: string;
  @IsNumber() orden: number;
  @IsOptional() videoUrl: string;
  @IsOptional() documentoUrl: string;
  @IsArray() @ValidateNested({ each: true })
  @Type(() => CreateEjercicioDto)
  ejercicios: CreateEjercicioDto[];
}
