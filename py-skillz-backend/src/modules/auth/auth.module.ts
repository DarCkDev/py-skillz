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
      secret:
        process.env.JWT_SECRET ?? 'etag:W/"34-rlKccw1E+/fV8niQk4oFitDfPro"',
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],
})
export class AuthModule {}
