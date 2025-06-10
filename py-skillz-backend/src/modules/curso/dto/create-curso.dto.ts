import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateEjercicioExaDto {
  @IsString()
  tipo: string;

  @IsString()
  pregunta: string;

  @IsArray()
  @IsString({ each: true })
  respuestas: string[];

  @IsNumber()
  orden: number;
}

class CreateExamenDto {
  @IsOptional()
  @IsNumber()
  tiempoExamen?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEjercicioExaDto)
  ejerciciosExa: CreateEjercicioExaDto[];
}

class CreateEjercicioDto {
  @IsString()
  tipo: string;

  @IsString()
  pregunta: string;

  @IsArray()
  @IsString({ each: true })
  respuestas: string[];

  @IsNumber()
  orden: number;
}

class CreateSubtituloDto {
  @IsString()
  tituloSubtitulo: string;

  @IsString()
  textoEnriquecido: string;

  @IsNumber()
  orden: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEjercicioDto)
  ejercicios: CreateEjercicioDto[];
}

class CreateTemaDto {
  @IsString()
  tituloTema: string;

  @IsNumber()
  orden: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubtituloDto)
  subtitulos: CreateSubtituloDto[];

  @ValidateNested()
  @Type(() => CreateExamenDto)
  examen: CreateExamenDto;
}

export class CreateCursoDto {
  @IsString()
  @IsNotEmpty()
  tituloCurso: string;

  @IsString()
  idiomaCurso: string;

  @IsString()
  nivel: string;

  @IsString()
  licenciaCurso: string;

  @IsString()
  descripcion: string;

  @IsString()
  @IsOptional()
  imagenDestacada?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTemaDto)
  temas: CreateTemaDto[];
}
