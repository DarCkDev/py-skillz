import { i18nValidationMessage } from 'nestjs-i18n';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../entities/role.entity';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Dante Alighieri',
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validations.invalidName') })
  fullName?: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'dante@alighieri.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: i18nValidationMessage('validations.invalidEmail') })
  email?: string;

  @ApiProperty({
    enum: Object.keys(Role),
    required: false,
  })
  @IsOptional()
  @IsEnum(Role, { message: i18nValidationMessage('validations.invalidRole') })
  role?: Role;
}
