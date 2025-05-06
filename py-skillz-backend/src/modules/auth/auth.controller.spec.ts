import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<Record<keyof AuthService, jest.Mock>>;

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should call authService.login and return the result', async () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: '12345678',
    };

    const expectedResponse: LoginResponseDto = {
      email: loginDto.email,
      token: 'fake-token',
    };

    mockAuthService.login!.mockResolvedValue(expectedResponse);

    const result = await controller.login(loginDto);

    expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    expect(result).toEqual(expectedResponse);
  });
});
