import {
  IsString, IsNotEmpty, IsArray,
  ValidateNested, IsOptional, IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTemaDto } from './create-tema.dto';

export class CreateCursoDto {
  @IsString() @IsNotEmpty() tituloCurso: string;
  @IsString() idiomaCurso: string;
  @IsString() nivel: string;
  @IsString() licenciaCurso: string;
  @IsString() descripcion: string;
  @IsString() @IsOptional() imagenDestacada?: string;
  @IsArray() @ValidateNested({ each: true })
  @Type(() => CreateTemaDto)
  temas: CreateTemaDto[];
}
