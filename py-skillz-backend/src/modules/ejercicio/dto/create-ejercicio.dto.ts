import {
  IsString, IsNumber, IsArray, ValidateNested, ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEjercicioDto {
  @IsNumber() subtituloId: number;
  @IsString() tipo: string;
  @IsString() pregunta: string;

  @ValidateIf(o => o.tipo==='opcion_multiple')
  @IsArray() @ValidateNested({ each:true })
  @Type(() => Object) respuestas?: any[];

  @ValidateIf(o => o.tipo==='quiz')
  @IsString() respuestasString?: string;

  @ValidateIf(o => o.tipo==='codigo')
  @IsString() codigoBase?: string;
  @ValidateIf(o => o.tipo==='codigo')
  @IsString() resultadoEsperado?: string;
  @ValidateIf(o => o.tipo==='codigo')
  @IsString() feedbackSugerido?: string;

  @ValidateIf(o => o.tipo==='link')
  @IsString() url?: string;

  @IsNumber() orden: number;
}
