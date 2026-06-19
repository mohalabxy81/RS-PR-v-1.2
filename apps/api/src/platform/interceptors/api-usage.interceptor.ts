import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ApiUsageInterceptor implements NestInterceptor {
  constructor(
    @InjectQueue('api-usage-queue') private readonly usageQueue: Queue,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();
    
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        // Log if it was an API key request (identified by ApiKeyGuard)
        if (request.apiKeyId && request.tenantId) {
          // Push to BullMQ queue asynchronously to avoid blocking the response
          this.usageQueue.add('log-usage', {
            apiKeyId: request.apiKeyId,
            tenantId: request.tenantId,
            endpoint: request.url,
            method: request.method,
            statusCode: response.statusCode || 200,
            requestSize: request.socket?.bytesRead || 0,
            responseSize: response.socket?.bytesWritten || 0,
            latencyMs: Date.now() - startTime,
            costUnit: 1, // Standard cost
            ipAddress: request.ip || request.socket?.remoteAddress,
            userAgent: request.headers['user-agent'],
            timestamp: new Date().toISOString(),
          }, {
            removeOnComplete: true,
            removeOnFail: false, // Keep for debugging if DB fails
          }).catch(err => {
            console.error('Failed to enqueue usage log', err);
          });
        }
      }),
    );
  }
}
