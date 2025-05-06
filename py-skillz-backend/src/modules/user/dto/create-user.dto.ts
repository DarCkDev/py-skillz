import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Dante Alighieri',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  fullName: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'dante@alighieri.com',
  })
  @IsEmail({}, { message: 'El email es inválido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: '123456&Lasd',
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6)
  password: string;

  @ApiProperty({
    enum: Object.keys(Role),
  })
  @IsEnum(Role, { message: 'El rol es inválido' })
  role: Role;
}
