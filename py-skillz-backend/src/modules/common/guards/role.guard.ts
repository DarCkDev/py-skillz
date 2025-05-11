import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Role } from '../../user/entities/role.entity';
import { Observable } from 'rxjs';
import { PayloadDto } from 'src/modules/auth/dto/payload.dto';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user }: { user: PayloadDto } = context.switchToHttp().getRequest();

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('No tienes permisos para acceder.');
    }

    return true;
  }
}
