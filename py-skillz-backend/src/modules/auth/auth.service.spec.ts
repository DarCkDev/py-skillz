import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
// import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../user/entities/role.entity';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserService: Partial<Record<keyof UserService, jest.Mock>>;
  let mockJwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  const mockUser = {
    id: 'user-id',
    fullName: 'Test User',
    email: 'test@example.com',
    role: Role.STUDENT,
  };

  beforeEach(async () => {
    mockUserService = {
      findUserByEmailAndPassword: jest.fn(),
      create: jest.fn(),
    };

    mockJwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return token and email on success', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'testpass',
      };

      mockUserService!.findUserByEmailAndPassword!.mockResolvedValue(mockUser);
      mockJwtService!.signAsync!.mockResolvedValue('jwt-token');

      const result = await service.login(dto);

      expect(mockUserService.findUserByEmailAndPassword).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );
      expect(result).toEqual({
        email: mockUser.email,
        token: 'jwt-token',
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserService!.findUserByEmailAndPassword!.mockResolvedValue(null);

      await expect(
        service.login({ email: 'wrong', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  /*describe('register', () => {
    it('should delegate user creation to userService', async () => {
      const dto: CreateUserDto = {
        fullName: 'New User',
        email: 'new@example.com',
        password: 'secure123',
        role: Role.STUDENT,
      };

      mockUserService.create.mockResolvedValue({ ...dto, id: '123' });

      const result = await service.register(dto);

      expect(mockUserService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ ...dto, id: '123' });
    });
  });*/
});
