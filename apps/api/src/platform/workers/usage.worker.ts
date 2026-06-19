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
  private batchBuffer: any[] = [];
  private readonly batchSize = 100;
  private timer: NodeJS.Timeout;

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly eventDispatcher: EventDispatcherService,
  ) {
    super();
    this.timer = setInterval(() => this.flushBatch(), 5000);
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const data = job.data;
    
    // Add to in-memory batch buffer to reduce DB writes
    this.batchBuffer.push({
      tenantId: data.tenantId,
      apiKeyId: data.apiKeyId,
      endpoint: data.endpoint,
      method: data.method,
      statusCode: data.statusCode,
      requestSize: data.requestSize,
      responseSize: data.responseSize,
      latencyMs: data.latencyMs,
      costUnit: data.costUnit,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      timestamp: new Date(data.timestamp),
    });

    if (this.batchBuffer.length >= this.batchSize) {
      await this.flushBatch();
    }

    if (data.apiKeyId) {
      // Async update of lastUsedAt, don't wait for it
      this.prisma.apiKey.update({
        where: { id: data.apiKeyId },
        data: { lastUsedAt: new Date(data.timestamp) },
      }).catch(err => this.logger.error('Failed to update apiKey lastUsedAt', err));
    }

    // Quota threshold tracking in Redis (e.g. per month)
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const quotaKey = `tenant_usage:${data.tenantId}:${currentMonth}`;
    const newUsage = await this.cacheManager.get<number>(quotaKey) || 0 + data.costUnit;
    await this.cacheManager.set(quotaKey, newUsage, 31 * 24 * 60 * 60 * 1000); // 31 days

    // Check threshold
    const threshold = 10000;
    if (newUsage >= threshold) {
      await this.eventDispatcher.dispatch('tenant.quota_exceeded', {
        tenantId: data.tenantId,
        usage: newUsage,
        threshold,
      });
    }
  }

  private async flushBatch() {
    if (this.batchBuffer.length === 0) return;

    const currentBatch = [...this.batchBuffer];
    this.batchBuffer = [];

    try {
      await this.prisma.apiUsageLog.createMany({
        data: currentBatch,
        skipDuplicates: true,
      });
      this.logger.debug(`Flushed ${currentBatch.length} API usage logs to DB`);
    } catch (err) {
      this.logger.error('Failed to batch insert usage logs', err.stack);
    }
  }
}
