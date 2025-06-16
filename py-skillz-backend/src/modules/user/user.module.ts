import { Module, OnModuleInit } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule implements OnModuleInit {
  constructor(private readonly userService: UserService) {}

  async onModuleInit() {
    try {
      const adminExists = await this.userService.findByEmail('admin@gmail.com');
      if (!adminExists) {
        await this.userService.create({
          fullName: 'Administrador',
          email: 'admin@gmail.com',
          password: 'admin',
          role: Role.ADMIN,
        });
        console.log('Usuario administrador creado exitosamente');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error al crear usuario administrador:', error.message);
      } else {
        console.error('Error desconocido al crear usuario administrador');
      }
    }
  }
}
