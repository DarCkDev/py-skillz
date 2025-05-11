import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBadRequestResponse, ApiResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from './dto/error-response-dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auht.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from './entities/role.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Post()
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 201,
    type: UserResponseDto,
  })
  async create(@Body() userDto: CreateUserDto) {
    return await this.userService.create(userDto);
  }
}
