import { IsString, MaxLength } from 'class-validator';

export class RunCodeDto {
  @IsString()
  @MaxLength(10000, { message: 'Code exceeds maximum length of 10000 characters' })
  code: string;
} 