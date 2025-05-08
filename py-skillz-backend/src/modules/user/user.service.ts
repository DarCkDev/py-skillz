import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { comparePassword, hashPassword } from 'src/utils/bcrypt.util';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly i18n: I18nService,
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
        message: [
          this.i18n.t('validations.emailAlreadyExists', {
            lang: I18nContext.current()?.lang,
          }),
        ],
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
