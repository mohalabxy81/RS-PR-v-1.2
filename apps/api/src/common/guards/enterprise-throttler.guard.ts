import { Injectable, ExecutionContext, Inject } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { PrismaService } from '../../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

const PLAN_LIMITS: Record<string, number> = {
  STARTER: 1000,
  PROFESSIONAL: 10000,
  ENTERPRISE: 100000,
};

@Injectable()
export class EnterpriseThrottlerGuard extends ThrottlerGuard {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Inject(CACHE_MANAGER)
  private readonly cacheManager: Cache;

  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Track by API Key first, then Tenant, then IP
    if (req.apiKeyId) {
      return `apikey:${req.apiKeyId}`;
    }
    if (req.tenantId) {
      return `tenant:${req.tenantId}:${req.ip}`;
    }
    return `ip:${req.ip}`;
  }

  protected async handleRequest(
    requestProps: any,
  ): Promise<boolean> {
    const context: ExecutionContext = requestProps.context;
    const req = context.switchToHttp().getRequest();
    
    let limit = requestProps.limit;

    if (req.tenantId) {
      const cacheKey = `tenant:plan:${req.tenantId}`;
      let plan = await this.cacheManager.get<string>(cacheKey);
      
      if (!plan) {
        const tenant = await this.prisma.tenant.findUnique({
          where: { id: req.tenantId },
          select: { subscriptionPlan: true },
        });
        plan = tenant?.subscriptionPlan || 'STARTER';
        await this.cacheManager.set(cacheKey, plan, 300000); // cache for 5 minutes
      }

      limit = PLAN_LIMITS[plan] || PLAN_LIMITS.STARTER;
      requestProps.limit = limit;
    }

    const result = await super.handleRequest(requestProps);
    if (!result) {
      throw new ThrottlerException(`Rate limit exceeded for your current plan. Limit is ${limit} reqs/min.`);
    }
    
    // Add X-RateLimit-* headers manually since ThrottlerGuard adds some but we can enforce logic here if needed
    // ThrottlerGuard normally adds X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset to Response
    
    return true;
  }
}
