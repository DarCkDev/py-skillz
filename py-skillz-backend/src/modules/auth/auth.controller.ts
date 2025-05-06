import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../user/dto/error-response-dto';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 201,
    type: LoginResponseDto,
  })
  login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 201,
    type: UserResponseDto,
  })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
