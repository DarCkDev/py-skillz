import {
  IsString, IsNumber, IsOptional,
} from 'class-validator';

export class CreateSubtituloDto {
  @IsString() titulo: string;
  @IsString() contenidoHtml: string;
  @IsOptional() videoUrl: string;
  @IsOptional() documentoUrl: string;
  @IsNumber() orden: number;
  // ejercicios se crean desde CursoService
}
