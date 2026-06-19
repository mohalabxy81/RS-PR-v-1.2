import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'An unexpected error occurred';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, any>;
        message = resp.message || message;
        error = resp.error || error;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle Prisma errors — never expose raw DB errors to client
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        message = 'A record with this value already exists';
        error = 'Conflict';
      } else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        error = 'Not Found';
      } else {
        // Log internally but return generic message
        this.logger.error(
          `Prisma error ${exception.code}: ${exception.message}`,
          exception.stack,
        );
      }
    } else if (exception instanceof Error) {
      // Log full error internally, return generic response to client
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
        { path: request.url, method: request.method },
      );
    }

    const requestId = (request as any).id || request.headers['x-request-id'] || 'unknown';
    const correlationId = (request as any).correlationId || request.headers['x-correlation-id'] || requestId;

    response.status(status).json({
      success: false,
      error: {
        code: status,
        type: error,
        message,
      },
      path: request.url,
      requestId,
      correlationId,
      timestamp: new Date().toISOString(),
    });
  }
}
