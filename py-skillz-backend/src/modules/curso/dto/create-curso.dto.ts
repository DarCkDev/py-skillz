import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNumber,
  IsBoolean,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

class RespuestaOpcionMultipleDto {
  @IsString()
  texto: string;

  @IsBoolean()
  correcta: boolean;
}

class EjercicioOpcionMultipleDto {
  @IsString()
  tipo: string;

  @IsString()
  pregunta: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RespuestaOpcionMultipleDto)
  respuestas: RespuestaOpcionMultipleDto[];

  @IsNumber()
  orden: number;
}

class EjercicioCodigoDto {
  @IsString()
  tipo: string;

  @IsString()
  pregunta: string;

  @IsString()
  codigoBase: string;

  @IsString()
  resultadoEsperado: string;

  @IsString()
  feedbackSugerido: string;

  @IsNumber()
  orden: number;
}

class EjercicioLinkDto {
  @IsString()
  tipo: string;

  @IsString()
  pregunta: string;

  @IsString()
  url: string;

  @IsNumber()
  orden: number;
}

class EjercicioQuizDto {
  @IsString()
  tipo: string;

  @IsString()
  pregunta: string;

  @IsString()
  respuestas: string;

  @IsNumber()
  orden: number;
}

class CreateEjercicioExaDto {
  @IsString()
  tipo: string;

  @IsString()
  pregunta: string;

  @ValidateIf(o => o.tipo === 'opcion_multiple')
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RespuestaOpcionMultipleDto)
  respuestas?: RespuestaOpcionMultipleDto[];

  @ValidateIf(o => o.tipo === 'quiz')
  @IsString()
  respuestasString?: string;

  @ValidateIf(o => o.tipo === 'codigo')
  @IsString()
  codigoBase?: string;

  @ValidateIf(o => o.tipo === 'codigo')
  @IsString()
  resultadoEsperado?: string;

  @ValidateIf(o => o.tipo === 'codigo')
  @IsString()
  feedbackSugerido?: string;

  @ValidateIf(o => o.tipo === 'link')
  @IsString()
  url?: string;

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

  @ValidateIf(o => o.tipo === 'opcion_multiple')
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RespuestaOpcionMultipleDto)
  respuestas?: RespuestaOpcionMultipleDto[];

  @ValidateIf(o => o.tipo === 'quiz')
  @IsString()
  respuestasString?: string;

  @ValidateIf(o => o.tipo === 'codigo')
  @IsString()
  codigoBase?: string;

  @ValidateIf(o => o.tipo === 'codigo')
  @IsString()
  resultadoEsperado?: string;

  @ValidateIf(o => o.tipo === 'codigo')
  @IsString()
  feedbackSugerido?: string;

  @ValidateIf(o => o.tipo === 'link')
  @IsString()
  url?: string;

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
