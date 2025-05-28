import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class LoginDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'dante@alighieri.com',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validations.requiredEmail') })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: '123456&Lasd',
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validations.requiredPassword'),
  })
  password: string;
}
