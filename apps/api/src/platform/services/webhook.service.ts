import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomBytes } from 'crypto';
import { RegisterWebhookDto, UpdateWebhookDto } from '../dto/webhook.dto';

@Injectable()
export class WebhookService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Webhooks ---

  async registerWebhook(tenantId: string, projectId: string, data: RegisterWebhookDto) {
    const secret = `whsec_${randomBytes(24).toString('hex')}`;
    return this.prisma.webhookEndpoint.create({
      data: {
        tenantId,
        projectId,
        url: data.url,
        events: data.events,
        secret,
        status: 'ACTIVE',
      },
    });
  }

  async getWebhooks(tenantId: string, projectId: string) {
    return this.prisma.webhookEndpoint.findMany({
      where: { projectId, tenantId },
    });
  }

  async updateWebhook(tenantId: string, webhookId: string, data: UpdateWebhookDto) {
    const endpoint = await this.prisma.webhookEndpoint.findFirst({
      where: { id: webhookId, tenantId },
    });
    if (!endpoint) throw new NotFoundException('Webhook not found');

    return this.prisma.webhookEndpoint.update({
      where: { id: webhookId },
      data: {
        ...(data.url && { url: data.url }),
        ...(data.events && { events: data.events }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
  }

  async deleteWebhook(tenantId: string, webhookId: string) {
    const endpoint = await this.prisma.webhookEndpoint.findFirst({
      where: { id: webhookId, tenantId },
    });
    if (!endpoint) throw new NotFoundException('Webhook not found');

    return this.prisma.webhookEndpoint.delete({
      where: { id: webhookId },
    });
  }

  // --- Delivery Logs ---

  async getDeliveries(tenantId: string, webhookId: string) {
    return this.prisma.webhookDelivery.findMany({
      where: { endpointId: webhookId, tenantId },
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit to recent logs
    });
  }

  // --- Events ---

  async logEvent(tenantId: string, data: any) {
    return this.prisma.eventLog.create({
      data: { ...data, tenantId },
    });
  }

  async getEventLogs(tenantId: string) {
    return this.prisma.eventLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
