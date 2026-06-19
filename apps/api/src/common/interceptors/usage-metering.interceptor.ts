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
      const developerId = request.developerId; // Set by Developer AuthGuard

      if (!tenantId && !developerId) return; // Skip if no tenant or developer

      const latencyMs = Date.now() - startTime;
      const statusCode = error ? error.status || 500 : response.statusCode;

      // Estimate sizes using content-length if available, otherwise fallback
      const reqContentLength = request.headers['content-length'];
      const requestSize = reqContentLength 
        ? parseInt(reqContentLength, 10) 
        : (request.body ? Buffer.byteLength(JSON.stringify(request.body)) : 0);

      const resContentLength = response.getHeaders?.()?.['content-length'];
      const responseSize = resContentLength
        ? parseInt(resContentLength as string, 10)
        : (responseBody ? Buffer.byteLength(JSON.stringify(responseBody)) : 0);

      // Calculate cost unit (simple example: 1 per request + extra for large payloads)
      let costUnit = 1.0;
      if (requestSize + responseSize > 1024 * 100) { // Over 100KB
        costUnit += 1.0;
      }

      // Add to queue for asynchronous processing
      await this.usageQueue.add('log-usage', {
        tenantId,
        developerId,
        apiKeyId,
        endpoint: request.url,
        method: request.method,
        statusCode,
        requestSize,
        responseSize,
        latencyMs,
        costUnit,
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      this.logger.error('Failed to enqueue usage log', err.stack);
    }
  }
}
