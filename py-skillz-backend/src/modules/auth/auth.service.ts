import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userService.findUserByEmailAndPassword(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: ['Los credenciales no son correctos.'],
        error: 'Bad Request',
      });
    }
    const payload = {
      sub: user.id,
      username: user.fullName,
    };

    const token = await this.jwtService.signAsync(payload);
    return {
      email: user.email,
      token,
    };
  }

  async register(createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }
}
