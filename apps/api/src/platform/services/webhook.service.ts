import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { RegisterWebhookDto, UpdateWebhookDto } from '../dto/webhook.dto';

@Injectable()
export class WebhookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  // --- Webhooks ---

  async registerWebhook(tenantId: string, projectId: string, data: RegisterWebhookDto) {
    if (this.config.get('NODE_ENV') === 'production' && !data.url.startsWith('https://')) {
      throw new BadRequestException('Webhook URLs must use HTTPS in production');
    }
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
      select: {
        id: true,
        tenantId: true,
        projectId: true,
        url: true,
        events: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
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

  async rotateSecret(tenantId: string, webhookId: string) {
    const endpoint = await this.prisma.webhookEndpoint.findFirst({
      where: { id: webhookId, tenantId },
    });
    if (!endpoint) throw new NotFoundException('Webhook not found');

    const newSecret = `whsec_${randomBytes(24).toString('hex')}`;
    
    const gracePeriodEndsAt = new Date();
    gracePeriodEndsAt.setHours(gracePeriodEndsAt.getHours() + 24);

    await this.prisma.webhookEndpoint.update({
      where: { id: webhookId },
      data: { 
        secret: newSecret,
        oldSecret: endpoint.secret,
        secretGracePeriodExpiresAt: gracePeriodEndsAt
      },
    });

    return { secret: newSecret };
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
