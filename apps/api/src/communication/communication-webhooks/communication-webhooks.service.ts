import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class CommunicationWebhooksService {
  private readonly logger = new Logger(CommunicationWebhooksService.name);

  constructor(@InjectQueue('webhooks') private webhooksQueue: Queue) {}

  async processIncomingWebhook(providerAccountId: string, payload: any, signature: string) {
    this.logger.log(`Received webhook for provider account ${providerAccountId}`);
    
    // Add to BullMQ for asynchronous processing
    await this.webhooksQueue.add('process-webhook', {
      providerAccountId,
      payload,
      signature,
      receivedAt: new Date().toISOString(),
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });

    return { status: 'queued' };
  }
}
