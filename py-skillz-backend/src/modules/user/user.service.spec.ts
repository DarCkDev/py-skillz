import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcryptUtil from 'src/utils/bcrypt.util';
import { BadRequestException } from '@nestjs/common';
import { Role } from './entities/role.entity';

describe('UserService', () => {
  let service: UserService;
  let repo: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: '1',
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: Role.STUDENT,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get(getRepositoryToken(User));
  });

  describe('create()', () => {
    it('debe crear un usuario si el email no existe', async () => {
      const dto: CreateUserDto = {
        fullName: 'New User',
        email: 'new@example.com',
        password: 'securePass',
        role: Role.STUDENT,
      };

      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      jest.spyOn(bcryptUtil, 'hashPassword').mockResolvedValue('hashedPass');
      jest.spyOn(repo, 'create').mockReturnValue({
        ...dto,
        id: '2',
        password: 'hashedPass',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User);
      jest.spyOn(repo, 'save').mockResolvedValue({
        ...dto,
        id: '2',
        password: 'hashedPass',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User);

      const result = await service.create(dto);
      expect(result).toHaveProperty('email', dto.email);
      expect(result).not.toHaveProperty('password');
    });

    it('debe lanzar excepción si el email ya existe', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockUser);

      await expect(
        service.create({
          fullName: 'Test',
          email: mockUser.email,
          password: '123456',
          role: Role.STUDENT,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll()', () => {
    it('debe retornar lista de usuarios', async () => {
      jest.spyOn(repo, 'find').mockResolvedValue([mockUser]);

      const users = await service.findAll();
      expect(users).toHaveLength(1);
      expect(users[0].email).toBe(mockUser.email);
    });
  });

  describe('findUserByEmailAndPassword()', () => {
    it('debe retornar null si no se encuentra el usuario', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      const result = await service.findUserByEmailAndPassword('x', 'y');
      expect(result).toBeNull();
    });

    it('debe retornar null si la contraseña no coincide', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcryptUtil, 'comparePassword').mockResolvedValue(false);
      const result = await service.findUserByEmailAndPassword(
        mockUser.email,
        'wrongpass',
      );
      expect(result).toBeNull();
    });

    it('debe retornar el usuario si el email y password son correctos', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcryptUtil, 'comparePassword').mockResolvedValue(true);
      const result = await service.findUserByEmailAndPassword(
        mockUser.email,
        'hashedPassword',
      );
      expect(result).toHaveProperty('email', mockUser.email);
    });
  });
});
