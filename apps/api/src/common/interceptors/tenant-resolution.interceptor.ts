import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantResolutionInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

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
      const tenant = await this.prisma.tenant.findUnique({
        where: { domain },
        select: { id: true, status: true },
      });
      if (tenant) {
        if (tenant.status !== 'ACTIVE' && tenant.status !== 'TRIAL') {
          throw new BadRequestException('Tenant account is not active');
        }
        tenantId = tenant.id;
      }
    }

    if (tenantId) {
      // We can also use Redis cache here to validate tenant ID to save DB hits
      request.tenantId = tenantId;
    }

    return next.handle();
  }
}
