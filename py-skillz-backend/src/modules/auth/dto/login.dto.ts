import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
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
  password: string;
}
