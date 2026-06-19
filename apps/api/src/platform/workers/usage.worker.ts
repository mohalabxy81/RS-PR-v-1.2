import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { EventDispatcherService } from '../services/event-dispatcher.service';

@Processor('api-usage-queue')
export class UsageWorker extends WorkerHost {
  private readonly logger = new Logger(UsageWorker.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly eventDispatcher: EventDispatcherService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const {
      tenantId,
      developerId,
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

    // Quota threshold tracking in Redis (e.g. per month)
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const quotaKey = `tenant_usage:${tenantId}:${currentMonth}`;
    const newUsage = await this.cacheManager.get<number>(quotaKey) || 0 + costUnit;
    await this.cacheManager.set(quotaKey, newUsage, 31 * 24 * 60 * 60 * 1000); // 31 days

    // Check threshold (hardcoded simple logic for phase 1)
    const threshold = 10000;
    if (newUsage >= threshold) {
      await this.eventDispatcher.dispatch('tenant.quota_exceeded', {
        tenantId,
        usage: newUsage,
        threshold,
      });
    }
  }
}
