import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../user/dto/error-response-dto';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RoleGuard } from '../common/guards/role.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auht.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../user/entities/role.entity';

@ApiBearerAuth('access_token')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiHeader({
    name: 'x-custom-lang',
    description: 'Language response: es|ay|qu|gn',
    required: false,
  })
  @ApiResponse({
    status: 201,
    type: LoginResponseDto,
    description: 'Login successful.',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: 'Login failed.',
  })
  login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiHeader({
    name: 'x-custom-lang',
    description: 'Language response: es|ay|qu|gn',
    required: false,
  })
  @ApiResponse({
    status: 201,
    type: UserResponseDto,
    description: 'Register successful.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Register failed.',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
