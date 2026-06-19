import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomBytes } from 'crypto';
import { RegisterWebhookDto, UpdateWebhookDto } from '../dto/webhook.dto';

@Injectable()
export class WebhookService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Webhooks ---

  async registerWebhook(projectId: string, data: RegisterWebhookDto) {
    const secret = `whsec_${randomBytes(24).toString('hex')}`;
    return this.prisma.webhookEndpoint.create({
      data: {
        projectId,
        url: data.url,
        events: data.events,
        secret,
        status: 'ACTIVE',
      },
    });
  }

  async getWebhooks(projectId: string) {
    return this.prisma.webhookEndpoint.findMany({
      where: { projectId },
    });
  }

  async updateWebhook(webhookId: string, data: UpdateWebhookDto) {
    return this.prisma.webhookEndpoint.update({
      where: { id: webhookId },
      data: {
        ...(data.url && { url: data.url }),
        ...(data.events && { events: data.events }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
  }

  async deleteWebhook(webhookId: string) {
    return this.prisma.webhookEndpoint.delete({
      where: { id: webhookId },
    });
  }

  // --- Delivery Logs ---

  async getDeliveries(webhookId: string) {
    return this.prisma.webhookDelivery.findMany({
      where: { endpointId: webhookId },
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit to recent logs
    });
  }

  // --- Events ---

  async logEvent(data: any) {
    return this.prisma.eventLog.create({
      data,
    });
  }

  async getEventLogs() {
    return this.prisma.eventLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
