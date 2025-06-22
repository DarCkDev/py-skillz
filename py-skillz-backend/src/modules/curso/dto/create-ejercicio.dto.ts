import {
  IsString, IsNumber, IsArray, ValidateNested, ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

class RespuestaOpcionMultipleDto {
  @IsString() texto: string;
  @IsBoolean() correcta: boolean;
}

export class CreateEjercicioDto {
  @IsString() tipo: string;
  @IsString() pregunta: string;
  @ValidateIf(o => o.tipo === 'opcion_multiple')
  @IsArray() @ValidateNested({ each: true })
  @Type(() => RespuestaOpcionMultipleDto)
  respuestas?: RespuestaOpcionMultipleDto[];
  @ValidateIf(o => o.tipo === 'quiz')
  @IsString() respuestasString?: string;
  @ValidateIf(o => o.tipo === 'codigo')
  @IsString() codigoBase?: string;
  @ValidateIf(o => o.tipo === 'codigo')
  @IsString() resultadoEsperado?: string;
  @ValidateIf(o => o.tipo === 'codigo')
  @IsString() feedbackSugerido?: string;
  @ValidateIf(o => o.tipo === 'link')
  @IsString() url?: string;
  @IsNumber() orden: number;
}
