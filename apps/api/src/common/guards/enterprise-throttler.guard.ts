import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

@Injectable()
export class EnterpriseThrottlerGuard extends ThrottlerGuard {
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
    const { req } = requestProps;

    // Ideally fetch dynamic limits based on req.tenantId or req.apiKeyId from Redis here
    // For now, we rely on default limits from decorators or module init, 
    // but the tracker string ensures we rate limit per tenant/apikey instead of just IP.

    const result = await super.handleRequest(requestProps);
    if (!result) {
      throw new ThrottlerException('Rate limit exceeded for your current plan');
    }
    return true;
  }
}
