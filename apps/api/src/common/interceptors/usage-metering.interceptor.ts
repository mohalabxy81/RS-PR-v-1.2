import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class UsageMeteringInterceptor implements NestInterceptor {
  private readonly logger = new Logger(UsageMeteringInterceptor.name);

  constructor(@InjectQueue('api-usage-queue') private usageQueue: Queue) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (responseBody) => this.logUsage(context, startTime, responseBody, null),
        error: (error) => this.logUsage(context, startTime, null, error),
      }),
    );
  }

  private async logUsage(
    context: ExecutionContext,
    startTime: number,
    responseBody: any,
    error: any,
  ) {
    try {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();

      const tenantId = request.tenantId; // Set by TenantResolutionInterceptor
      const apiKeyId = request.apiKeyId; // Set by ApiKeyGuard

      if (!tenantId) return; // Skip if no tenant (e.g. public non-tenant route)

      const latencyMs = Date.now() - startTime;
      const statusCode = error ? error.status || 500 : response.statusCode;

      // Estimate sizes
      const requestSize = JSON.stringify(request.body || {}).length;
      const responseSize = JSON.stringify(responseBody || {}).length;

      // Add to queue for asynchronous processing
      await this.usageQueue.add('log-usage', {
        tenantId,
        apiKeyId,
        endpoint: request.url,
        method: request.method,
        statusCode,
        requestSize,
        responseSize,
        latencyMs,
        costUnit: 1.0, // Default cost, can vary by endpoint
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      this.logger.error('Failed to enqueue usage log', err.stack);
    }
  }
}
