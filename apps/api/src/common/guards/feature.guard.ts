import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FEATURE_KEY } from '../decorators/require-feature.decorator';

@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(
      FEATURE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required || required.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const plan: string = request.tenantPlan;

    if (!plan) {
      throw new ForbiddenException('No subscription plan information found for this tenant');
    }

    const featureMap: Record<string, string[]> = {
      'STARTER':      [],
      'PROFESSIONAL': ['api-access', 'webhooks', 'data-export', 'ai-basic'],
      'ENTERPRISE':   ['api-access', 'webhooks', 'data-export', 'ai-basic',
                       'advanced-ai', 'white-label', 'sso', 'enterprise-governance',
                       'compliance', 'marketplace', 'api-marketplace'],
    };

    const available = featureMap[plan] ?? [];
    const hasAll = required.every(f => available.includes(f));
    
    if (!hasAll) {
      throw new ForbiddenException(`Feature not available on your plan: ${required.join(', ')}`);
    }
    
    return true;
  }
}
