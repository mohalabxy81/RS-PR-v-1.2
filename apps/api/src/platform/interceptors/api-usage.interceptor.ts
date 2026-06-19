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
    const apiKey = request.headers['x-api-key'];
    
    // We only log if there is an API key (assuming external developer request)
    return next.handle().pipe(
      tap(() => {
        if (apiKey) {
          // Push to BullMQ queue asynchronously to avoid blocking the response
          this.usageQueue.add('log-usage', {
            apiKey,
            path: request.url,
            method: request.method,
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
