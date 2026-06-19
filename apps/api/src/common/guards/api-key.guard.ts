import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeyService } from '../../platform/services/api-key.service';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';
import { SecurityMonitorService } from '../security/security-monitor.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly reflector: Reflector,
    private readonly securityMonitor: SecurityMonitorService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKeyHeader = request.headers['x-api-key'];

    if (!apiKeyHeader) {
      // If no API key is provided, we can either throw or let the standard AuthGuard handle it
      // if they are using Bearer tokens. Here we assume this guard is explicitly used 
      // for routes that require an API key.
      throw new UnauthorizedException('API Key is missing');
    }

    const ip = request.ip || request.socket.remoteAddress;
    const referer = request.headers['referer'] || request.headers['origin'];
    const apiKeyData = await this.apiKeyService.validateApiKey(apiKeyHeader, ip, referer);
    
    if (!apiKeyData) {
      await this.securityMonitor.recordInvalidApiKey(ip).catch((e: any) => console.error(e));
      throw new UnauthorizedException('Invalid or expired API Key');
    }

    // Check scopes/permissions
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredPermissions && requiredPermissions.length > 0) {
      // apiKeyData.scopes should exist, but let's be safe
      const keyScopes = apiKeyData.scopes || [];
      const hasScope = requiredPermissions.every((p) => keyScopes.includes(p));
      if (!hasScope) {
        throw new ForbiddenException('API Key lacks required scopes');
      }
    }

    // Attach API key info to request
    request.apiKeyId = apiKeyData.id;
    request.tenantId = apiKeyData.tenantId; // Automatically resolve tenant from API Key
    
    return true;
  }
}
