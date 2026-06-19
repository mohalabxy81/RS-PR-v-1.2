import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';

import { SecurityMonitorService } from '../../common/security/security-monitor.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly securityMonitor: SecurityMonitorService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext): TUser {
    if (err || !user) {
      const req = context.switchToHttp().getRequest();
      if (req && req.ip) {
        // Asynchronously record invalid token spike
        this.securityMonitor.recordInvalidToken(req.ip).catch((e: any) => console.error(e));
      }
      throw new UnauthorizedException('Authentication required');
    }
    return user;
  }
}
