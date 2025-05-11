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
import { I18nContext, I18nService } from 'nestjs-i18n';
import { CustomError } from '../response/custom-error';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly i18n: I18nService,
  ) {}

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
      throw new ForbiddenException(
        new CustomError(
          403,
          this.i18n.t('auth.noPermissions', {
            lang: I18nContext.current()?.lang,
          }),
          'Forbidden',
        ),
      );
    }

    return true;
  }
}
