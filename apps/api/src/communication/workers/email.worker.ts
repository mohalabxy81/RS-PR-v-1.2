import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
@Processor('email-queue', { concurrency: 5 })
export class EmailWorker extends WorkerHost {
  private readonly logger = new Logger(EmailWorker.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { to, subject, bodyHtml, tenantId } = job.data;
    this.logger.log(`Processing email job ${job.id} for tenant ${tenantId} to ${to}`);
    
    try {
      // In a real implementation, integrate with SendGrid, AWS SES, or similar provider here.
      // e.g. await this.emailService.send({ to, subject, body: bodyHtml });
      
      this.logger.debug(`[MOCK] Email sent successfully to ${to}. Subject: ${subject}`);
      
      return { success: true, deliveredAt: new Date().toISOString() };
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      throw error; // Let BullMQ handle retries
    }
  }
}
