import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createHmac } from 'crypto';

@Injectable()
@Processor('webhook-queue', { concurrency: 10 })
export class WebhookWorker extends WorkerHost {
  private readonly logger = new Logger(WebhookWorker.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { endpointId, eventType, payload } = job.data;

    const endpoint = await this.prisma.webhookEndpoint.findUnique({
      where: { id: endpointId },
    });

    if (!endpoint || endpoint.status !== 'ACTIVE') {
      this.logger.warn(`Webhook endpoint ${endpointId} not found or inactive`);
      return;
    }

    const maxRetries = 3;
    const attempt = job.attemptsMade;

    const signature = this.generateSignature(payload, endpoint.secret || '');

    try {
      this.logger.log(`Delivering webhook ${eventType} to ${endpoint.url}`);
      
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-reis-signature': signature,
          'x-reis-event': eventType,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      await this.prisma.webhookDelivery.create({
        data: {
          endpointId,
          eventId: payload.id || 'evt_' + Date.now(),
          payload: payload,
          statusCode: response.status,
          response: { text: responseText.slice(0, 1000) },
          status: response.ok ? 'SUCCESS' : 'FAILED',
        },
      });

      if (!response.ok) {
        if (attempt >= maxRetries) {
          this.logger.error(`Webhook delivery failed permanently to ${endpoint.url}`);
        } else {
          throw new Error(`Non-200 response: ${response.status}`);
        }
      }

      return { success: true };
    } catch (error) {
      this.logger.error(`Error delivering webhook: ${error.message}`);
      
      await this.prisma.webhookDelivery.create({
        data: {
          endpointId,
          eventId: payload.id || 'evt_' + Date.now(),
          payload: payload,
          statusCode: 0,
          response: { error: error.message },
          status: 'FAILED',
        },
      });

      if (attempt >= maxRetries) {
        this.logger.error(`Webhook delivery failed permanently after ${attempt + 1} attempts.`);
      } else {
        throw error;
      }
    }
  }

  private generateSignature(payload: any, secret: string): string {
    const payloadString = JSON.stringify(payload);
    return createHmac('sha256', secret).update(payloadString).digest('hex');
  }
}
