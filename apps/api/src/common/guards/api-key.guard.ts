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

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly reflector: Reflector,
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

    const apiKeyData = await this.apiKeyService.validateApiKey(apiKeyHeader);
    
    if (!apiKeyData) {
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
      // An API key might have a '*' wildcard scope, or needs specific match
      const hasScope = keyScopes.includes('*') || requiredPermissions.every((p) => keyScopes.includes(p));
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
