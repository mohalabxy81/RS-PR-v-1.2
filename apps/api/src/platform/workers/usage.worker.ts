import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';

@Processor('api-usage-queue')
export class UsageWorker extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const {
      tenantId,
      apiKeyId,
      endpoint,
      method,
      statusCode,
      requestSize,
      responseSize,
      latencyMs,
      costUnit,
      ipAddress,
      userAgent,
      timestamp,
    } = job.data;

    await this.prisma.apiUsageLog.create({
      data: {
        tenantId,
        apiKeyId,
        endpoint,
        method,
        statusCode,
        requestSize,
        responseSize,
        latencyMs,
        costUnit,
        ipAddress,
        userAgent,
        timestamp: new Date(timestamp),
      },
    });

    if (apiKeyId) {
      await this.prisma.apiKey.update({
        where: { id: apiKeyId },
        data: { lastUsedAt: new Date(timestamp) },
      });
    }
  }
}
