import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiKeyService } from '../../platform/services/api-key.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService) {}

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

    // Attach API key info to request
    request.apiKeyId = apiKeyData.id;
    request.tenantId = apiKeyData.tenantId; // Automatically resolve tenant from API Key
    
    return true;
  }
}
