import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Role } from '../entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Dante Alighieri',
  })
  @IsString({ message: i18nValidationMessage('validations.invalidName') })
  @IsNotEmpty({ message: i18nValidationMessage('validations.requiredName') })
  fullName: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'dante@alighieri.com',
  })
  @IsEmail({}, { message: i18nValidationMessage('validations.invalidEmail') })
  @IsNotEmpty({ message: i18nValidationMessage('validations.requiredEmail') })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: '123456&Lasd',
  })
  @IsString({ message: i18nValidationMessage('validations.invalidPassword') })
  @IsNotEmpty({
    message: i18nValidationMessage('validations.requiredPassword'),
  })
  @MinLength(6, {
    message: i18nValidationMessage('validations.invalidPassword'),
  })
  password: string;

  @ApiProperty({
    enum: Object.keys(Role),
  })
  @IsEnum(Role, { message: i18nValidationMessage('validations.invalidRole') })
  role: Role;
}
