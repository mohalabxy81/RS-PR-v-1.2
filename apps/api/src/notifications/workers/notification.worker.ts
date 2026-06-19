import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
@Processor('notification-queue', { concurrency: 10 })
export class NotificationWorker extends WorkerHost {
  private readonly logger = new Logger(NotificationWorker.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { userId, tenantId, type, title, message } = job.data;
    this.logger.log(`Processing notification job ${job.id} for user ${userId}`);
    
    try {
      // 1. Save notification to DB if not already done
      // 2. Dispatch WebSocket event to connected client
      
      this.logger.debug(`[MOCK] Notification dispatched. Title: ${title}`);
      
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to dispatch notification: ${error.message}`);
      throw error;
    }
  }
}
