import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { PayloadDto } from './dto/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userService.findUserByEmailAndPassword(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: [
          this.i18n.t('validations.invalidCredentials', {
            lang: I18nContext.current()?.lang,
          }),
        ],
        error: 'Bad Request',
      });
    }
    const payload: PayloadDto = {
      sub: user.id,
      email: user.email,
      username: user.fullName,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);
    return {
      fullName: user.fullName,
      role: user.role,
      token,
    };
  }

  async register(createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }
}
