import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();
    
    const reqId = request.headers['x-request-id'] || `req_${uuidv4()}`;
    const corrId = request.headers['x-correlation-id'] || reqId;

    request.headers['x-request-id'] = reqId;
    request.headers['x-correlation-id'] = corrId;
    
    // Set response headers
    response.setHeader('X-Request-Id', reqId);
    response.setHeader('X-Correlation-Id', corrId);
    
    // Also attach to request object directly for easy access
    (request as any).id = reqId;
    (request as any).correlationId = corrId;

    return next.handle();
  }
}
