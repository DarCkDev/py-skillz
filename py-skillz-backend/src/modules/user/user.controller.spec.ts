import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from './entities/role.entity';
import { UserResponseDto } from './dto/user-response.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;

  const mockUserResponse: UserResponseDto = {
    id: 'uuid-1234',
    fullName: 'Test User',
    email: 'test@example.com',
    role: Role.STUDENT,
  };

  beforeEach(async () => {
    userService = {
      findAll: jest.fn().mockResolvedValue([mockUserResponse]),
      create: jest.fn().mockResolvedValue(mockUserResponse),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockUserResponse]);
      expect(userService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const dto: CreateUserDto = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'securePassword123',
        role: Role.STUDENT,
      };

      const result = await controller.create(dto);
      expect(result).toEqual(mockUserResponse);
      expect(userService.create).toHaveBeenCalledWith(dto);
    });
  });
});
