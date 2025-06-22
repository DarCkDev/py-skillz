import { IsString, IsNumber } from 'class-validator';

export class CreateTemaDto {
  @IsString() titulo: string;
  @IsNumber() orden: number;
  // relaciones se manejarán en CursoService
}
