import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSubtituloDto } from './create-subtitulo.dto';
import { CreateExamenDto } from './create-examen.dto';

export class CreateTemaDto {
  @IsString() tituloTema: string;
  @IsNumber() orden: number;
  @IsArray() @ValidateNested({ each: true })
  @Type(() => CreateSubtituloDto)
  subtitulos: CreateSubtituloDto[];
  @ValidateNested() @Type(() => CreateExamenDto)
  examen: CreateExamenDto;
}
