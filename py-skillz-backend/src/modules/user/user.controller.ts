import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from './dto/error-response-dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auht.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from './entities/role.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiBearerAuth('access_token')
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
  async create(@Body() userDto: CreateUserDto) {
    return await this.userService.create(userDto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @HttpCode(200)
  @ApiQuery({
    name: 'role',
    enum: Role,
    required: false,
  })
  @Get('count')
  async countUsers(@Query('role') role?: Role) {
    return await this.userService.countUsers(role);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiHeader({
    name: 'x-custom-lang',
    description: 'Language response: es|ay|qu|gn',
    required: false,
  })
  @ApiResponse({
    status: 200,
    type: UserResponseDto,
    description: 'Get user successful.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Get user failed.',
  })
  async findUserById(@Param('id') id: string) {
    return await this.userService.findUserById(id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/delete')
  @ApiHeader({
    name: 'x-custom-lang',
    description: 'Language response: es|ay|qu|gn',
    required: false,
  })
  @ApiResponse({
    status: 204,
    description: 'Delete user successful.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Delete user failed.',
  })
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Put(':id/update')
  @ApiHeader({
    name: 'x-custom-lang',
    description: 'Language response: es|ay|qu|gn',
    required: false,
  })
  @ApiResponse({
    status: 200,
    type: UserResponseDto,
    description: 'Update user successful.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Update user failed.',
  })
  async update(@Param('id') id: string, @Body() userDto: UpdateUserDto) {
    return await this.userService.update(id, userDto);
  }
}
