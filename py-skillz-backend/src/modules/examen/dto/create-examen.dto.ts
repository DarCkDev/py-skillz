import {
  IsArray, ValidateNested, IsOptional, IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEjercicioExaDto } from '../dto/create-ejercicio-exa.dto';

export class CreateExamenDto {
  @IsOptional() @IsNumber() tiempoExamen?: number;
  @IsArray() @ValidateNested({ each:true })
  @Type(() => CreateEjercicioExaDto)
  ejerciciosExa: CreateEjercicioExaDto[];
}
