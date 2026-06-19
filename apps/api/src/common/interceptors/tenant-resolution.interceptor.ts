import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class TenantResolutionInterceptor implements NestInterceptor {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    
    // Skip for public routes or docs
    if (request.url.includes('/api/docs') || request.url.includes('/health')) {
      return next.handle();
    }

    let tenantId = request.headers['x-tenant-id'];
    const domain = request.hostname;

    // Optional: resolve by domain if x-tenant-id is not provided
    if (!tenantId && domain && domain !== 'localhost' && !domain.includes('reis.com')) {
      const cacheKey = `tenant_domain:${domain}`;
      const cachedTenantId = await this.cacheManager.get<string>(cacheKey);

      if (cachedTenantId) {
        tenantId = cachedTenantId;
      } else {
        const tenant = await this.prisma.tenant.findUnique({
          where: { domain },
          select: { id: true, status: true },
        });
        if (tenant) {
          if (tenant.status !== 'ACTIVE' && tenant.status !== 'TRIAL') {
            throw new BadRequestException('Tenant account is not active');
          }
          tenantId = tenant.id;
          await this.cacheManager.set(cacheKey, tenantId, 3600000); // 1 hour cache
        }
      }
    }

    if (tenantId) {
      // Validate tenantId via cache to save DB hits
      const tenantCacheKey = `tenant_valid:${tenantId}`;
      let isValid = await this.cacheManager.get<boolean>(tenantCacheKey);

      if (isValid === undefined || isValid === null) {
        const tenant = await this.prisma.tenant.findUnique({
          where: { id: tenantId },
          select: { status: true },
        });
        
        isValid = tenant ? (tenant.status === 'ACTIVE' || tenant.status === 'TRIAL') : false;
        // Cache validation result for 5 minutes
        await this.cacheManager.set(tenantCacheKey, isValid, 300000);
      }

      if (!isValid) {
        throw new BadRequestException('Tenant account is not active or invalid');
      }

      request.tenantId = tenantId;
    }

    return next.handle();
  }
}
