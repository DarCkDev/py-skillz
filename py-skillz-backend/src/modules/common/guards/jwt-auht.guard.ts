import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/modules/user/entities/role.entity';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { PayloadDto } from 'src/modules/auth/dto/payload.dto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No se ha proporcionado un token');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No es un token válido');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload: PayloadDto = this.jwtService.verify(token);

      if (!payload || !payload.sub || !payload.role) {
        throw new UnauthorizedException(
          'No se ha proporcionado un token válido',
        );
      }

      if (!Object.values(Role).includes(payload.role)) {
        throw new UnauthorizedException('No se ha reconocido el rol del token');
      }

      request.user = {
        sub: payload.sub,
        username: payload.username,
        email: payload.email,
        role: payload.role,
      };

      return true;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('El token es inválido o ha expirado.');
    }
  }
}
