import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { comparePassword, hashPassword } from 'src/utils/bcrypt.util';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isUUID } from 'class-validator';
import { Role } from './entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly i18n: I18nService,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    return (
      await this.userRepository.find({
        order: { fullName: 'ASC' },
      })
    ).map((user) => this.parseUserResponse(user));
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

  async update(id: string, userDto: UpdateUserDto): Promise<UserResponseDto> {
    if (!this.isUUIDValid(id)) {
      throw new BadRequestException({
        statusCode: 400,
        message: [
          this.i18n.t('upload.invalidId', {
            lang: I18nContext.current()?.lang,
          }),
        ],
        error: 'Bad Request',
      });
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user)
      throw new NotFoundException({
        statusCode: 404,
        message: [
          this.i18n.t('validations.userNotFound', {
            lang: I18nContext.current()?.lang,
          }),
        ],
        error: 'Not Found',
      });

    if (userDto.email && userDto.email !== user.email) {
      const emailExists = await this.userRepository.findOne({
        where: { email: userDto.email },
      });
      if (emailExists) {
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
    }

    const updatedUser = this.userRepository.merge(user, userDto);
    const savedUser = await this.userRepository.save(updatedUser);

    return this.parseUserResponse(savedUser);
  }

  async delete(id: string): Promise<void> {
    if (!this.isUUIDValid(id)) {
      throw new BadRequestException({
        statusCode: 400,
        message: [
          this.i18n.t('upload.invalidId', {
            lang: I18nContext.current()?.lang,
          }),
        ],
        error: 'Bad Request',
      });
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user)
      throw new NotFoundException({
        statusCode: 404,
        message: [
          this.i18n.t('validations.userNotFound', {
            lang: I18nContext.current()?.lang,
          }),
        ],
        error: 'Not Found',
      });

    await this.userRepository.delete(id);
  }

  async findUserByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user)
      throw new NotFoundException({
        statusCode: 404,
        message: [
          this.i18n.t('validations.userNotFound', {
            lang: I18nContext.current()?.lang,
          }),
        ],
        error: 'Not Found',
      });
    return this.parseUserResponse(user);
  }

  async findUserById(id: string): Promise<UserResponseDto> {
    if (!this.isUUIDValid(id)) {
      throw new BadRequestException({
        statusCode: 400,
        message: [
          this.i18n.t('upload.invalidId', {
            lang: I18nContext.current()?.lang,
          }),
        ],
        error: 'Bad Request',
      });
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user)
      throw new NotFoundException({
        statusCode: 404,
        message: [
          this.i18n.t('validations.userNotFound', {
            lang: I18nContext.current()?.lang,
          }),
        ],
        error: 'Not Found',
      });
    return this.parseUserResponse(user);
  }

  async countUsers(role?: Role): Promise<number> {
    const users = !role
      ? await this.userRepository.count()
      : await this.userRepository.count({
          where: {
            role,
          },
        });
    return users;
  }

  private parseUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private isUUIDValid(uuid: string): boolean {
    return isUUID(uuid);
    /*const regexExp =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/gi;
    return regexExp.test(uuid);*/
  }
}
