import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Role } from '../user/entities/role.entity';
import { I18nService } from 'nestjs-i18n';

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

  const mockI18nService = {
    t: jest.fn((key: string) => key),
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
        { provide: I18nService, useValue: mockI18nService },
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
        fullName: mockUser.fullName,
        role: mockUser.role,
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
});
