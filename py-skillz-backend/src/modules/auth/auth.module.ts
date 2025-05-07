import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'CA19F18E64436BB3E965BA14843D7',
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],
})
export class AuthModule {}
