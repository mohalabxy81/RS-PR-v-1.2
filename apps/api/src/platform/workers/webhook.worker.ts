import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, UnrecoverableError } from 'bullmq';
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

    if (process.env.NODE_ENV === 'production' && !endpoint.url.startsWith('https://')) {
      this.logger.error(`Webhook endpoint ${endpoint.url} rejected: HTTPS required in production`);
      throw new UnrecoverableError('HTTPS required in production');
    }

    const maxRetries = 5;
    const attempt = job.attemptsMade;

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const eventId = payload.id || 'evt_' + Date.now();
    
    const signatures: string[] = [];
    signatures.push(`v1=${this.generateSignature(payload, endpoint.secret || '', timestamp, endpointId)}`);

    if (endpoint.oldSecret && endpoint.secretGracePeriodExpiresAt && endpoint.secretGracePeriodExpiresAt > new Date()) {
      signatures.push(`v1=${this.generateSignature(payload, endpoint.oldSecret, timestamp, endpointId)}`);
    }

    const signatureHeader = signatures.join(',');

    try {
      this.logger.log(`Delivering webhook ${eventType} to ${endpoint.url}`);
      
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': signatureHeader,
          'X-Timestamp': timestamp,
          'X-Webhook-ID': eventId,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      await this.prisma.webhookDelivery.create({
        data: {
          endpointId,
          tenantId: endpoint.tenantId,
          eventId: eventId,
          payload: payload,
          statusCode: response.status,
          response: { text: responseText.slice(0, 1000) },
          status: response.ok ? 'SUCCESS' : 'FAILED',
        },
      });

      if (!response.ok) {
        if (attempt >= maxRetries) {
          this.logger.error(`Webhook delivery failed permanently to ${endpoint.url}`);
          throw new UnrecoverableError(`Non-200 response: ${response.status}`);
        } else {
          // Delay next attempt using exponential backoff (e.g. 2^attempt * 1000ms)
          // BullMQ will auto-retry if job fails, but to ensure backoff we can use moveToDelayed or let BullMQ handle it
          // We will throw error and let BullMQ handle backoff if queue is configured
          throw new Error(`Non-200 response: ${response.status}`);
        }
      }

      return { success: true };
    } catch (error) {
      this.logger.error(`Error delivering webhook: ${error.message}`);
      
      await this.prisma.webhookDelivery.create({
        data: {
          endpointId,
          tenantId: endpoint.tenantId,
          eventId: eventId,
          payload: payload,
          statusCode: 0,
          response: { error: error.message },
          status: 'FAILED',
        },
      });

      if (attempt >= maxRetries) {
        this.logger.error(`Webhook delivery failed permanently after ${attempt + 1} attempts.`);
        throw new UnrecoverableError(error.message);
      } else {
        throw error;
      }
    }
  }

  private generateSignature(payload: any, secret: string, timestamp: string, webhookId: string): string {
    const payloadString = JSON.stringify(payload);
    const dataToSign = `${timestamp}.${webhookId}.${payloadString}`;
    return createHmac('sha256', secret).update(dataToSign).digest('hex');
  }
}
