import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

export interface Response<T> {
  success: boolean;
  data: T;
  meta?: any;
  requestId: string;
  correlationId: string;
  timestamp: string;
}

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const requestId = (request as any).id || request.headers['x-request-id'] || 'unknown';
    const correlationId = (request as any).correlationId || request.headers['x-correlation-id'] || requestId;

    return next.handle().pipe(
      map(data => {
        // Handle pagination structure
        if (data && typeof data === 'object' && ('data' in data || 'meta' in data)) {
          return {
            success: true,
            data: data.data !== undefined ? data.data : data,
            meta: data.meta,
            requestId,
            correlationId,
            timestamp: new Date().toISOString(),
          };
        }

        return {
          success: true,
          data,
          requestId,
          correlationId,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
