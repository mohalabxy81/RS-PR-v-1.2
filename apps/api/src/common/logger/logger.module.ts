import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      useFactory: () => {
        return {
          pinoHttp: {
            level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
            genReqId: (req: Request) => {
              const reqId = req.headers['x-request-id'] || randomUUID();
              req.headers['x-request-id'] = reqId; // Keep it uniform
              return reqId;
            },
            transport:
              process.env.NODE_ENV !== 'production'
                ? {
                    target: 'pino-pretty',
                    options: {
                      singleLine: true,
                      colorize: true,
                    },
                  }
                : undefined,
            customProps: (req: Request, res: Response) => ({
              context: 'HTTP',
              correlationId: req.headers['x-correlation-id'] || req.headers['x-request-id'],
            }),
            serializers: {
              req: (req: Request) => ({
                id: req.id,
                method: req.method,
                url: req.url,
                query: req.query,
                params: req.params,
                ip: req.ip,
              }),
              res: (res: Response) => ({
                statusCode: res.statusCode,
              }),
            },
          },
        };
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}
