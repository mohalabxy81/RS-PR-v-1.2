import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as any).user;

    if (!user || !user.tenantId) {
      throw new UnauthorizedException('Tenant context missing from token.');
    }

    // Attach tenantId directly to the request for easy access in controllers
    (request as any).tenantId = user.tenantId;

    return true;
  }
}
