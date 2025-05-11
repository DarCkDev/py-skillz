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
import { I18nService, I18nContext } from 'nestjs-i18n';
import { CustomError } from '../response/custom-error';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException(
        new CustomError(
          403,
          this.i18n.t('auth.noToken', {
            lang: I18nContext.current()?.lang,
          }),
          'Forbidden',
        ),
      );
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        new CustomError(
          403,
          this.i18n.t('auth.invalidToken', {
            lang: I18nContext.current()?.lang,
          }),
          'Forbidden',
        ),
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload: PayloadDto = this.jwtService.verify(token);

      if (!payload || !payload.sub || !payload.role) {
        throw new UnauthorizedException(
          new CustomError(
            403,
            this.i18n.t('auth.invalidToken', {
              lang: I18nContext.current()?.lang,
            }),
            'Forbidden',
          ),
        );
      }

      if (!Object.values(Role).includes(payload.role)) {
        throw new UnauthorizedException(
          new CustomError(
            403,
            this.i18n.t('auth.invalidRole', {
              lang: I18nContext.current()?.lang,
            }),
            'Forbidden',
          ),
        );
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
      throw new UnauthorizedException(
        new CustomError(
          403,
          this.i18n.t('auth.invalidOrExpiredToken', {
            lang: I18nContext.current()?.lang,
          }),
          'Forbidden',
        ),
      );
    }
  }
}
