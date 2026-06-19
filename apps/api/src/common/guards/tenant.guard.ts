import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PrismaService } from '../../prisma/prisma.service';
import type { Cache } from 'cache-manager';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.tenantId ?? request.user?.tenantId;

    if (!tenantId) throw new ForbiddenException('No tenant context');

    const cacheKey = `tenant:${tenantId}:guard`;
    let tenant = await this.cache.get<any>(cacheKey);

    if (!tenant) {
      tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { status: true, subscriptionPlan: true, subscriptionStatus: true, trialEndsAt: true },
      });
      if (tenant) {
        await this.cache.set(cacheKey, tenant, 60_000); // 1 min
      }
    }

    if (!tenant) throw new ForbiddenException('Tenant not found');
    if (tenant.status === 'SUSPENDED') throw new ForbiddenException('Tenant is suspended');
    if (tenant.status === 'CANCELLED') throw new ForbiddenException('Tenant account is cancelled');
    if (tenant.subscriptionStatus !== 'active') throw new ForbiddenException('Subscription inactive');
    if (tenant.status === 'TRIAL' && tenant.trialEndsAt && new Date(tenant.trialEndsAt) < new Date()) {
      throw new ForbiddenException('Trial period has expired');
    }

    // Attach to request for downstream use
    request.tenantPlan = tenant.subscriptionPlan;
    return true;
  }
}
