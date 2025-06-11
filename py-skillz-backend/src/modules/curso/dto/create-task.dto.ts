import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  instructions: string;

  @IsNumber()
  @IsNotEmpty()
  courseId: number;
  fileUrl?: string;
  tag?: string;
  objectives?: string;
  deadline?: Date;
} 