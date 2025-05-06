import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { comparePassword, hashPassword } from 'src/utils/bcrypt.util';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    return (await this.userRepository.find()).map((user) =>
      this.parseUserResponse(user),
    );
  }

  async create(userDto: CreateUserDto): Promise<UserResponseDto> {
    const { password, email, ...rest } = userDto;
    const userExists = await this.userRepository.findOne({ where: { email } });
    if (userExists) {
      throw new BadRequestException({
        statusCode: 400,
        message: ['El email ya está en uso'],
        error: 'Bad Request',
      });
    }
    const hashedPassword = await hashPassword(password);
    const user = this.userRepository.create({
      ...rest,
      email,
      password: hashedPassword,
    });
    const newUser = await this.userRepository.save(user);
    return this.parseUserResponse(newUser);
  }

  async findUserByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return user;
    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) return null;
    return this.parseUserResponse(user);
  }

  private parseUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
  }
}
