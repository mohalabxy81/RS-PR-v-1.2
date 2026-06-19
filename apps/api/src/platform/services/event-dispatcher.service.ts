import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EventDispatcherService {
  private readonly logger = new Logger(EventDispatcherService.name);

  constructor(
    @InjectQueue('webhook-queue') private readonly webhookQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  @OnEvent('lead.created')
  async handleLeadCreated(payload: any) {
    await this.dispatch('lead.created', payload);
  }

  @OnEvent('lead.updated')
  async handleLeadUpdated(payload: any) {
    await this.dispatch('lead.updated', payload);
  }

  @OnEvent('deal.created')
  async handleDealCreated(payload: any) {
    await this.dispatch('deal.created', payload);
  }

  @OnEvent('deal.updated')
  async handleDealUpdated(payload: any) {
    await this.dispatch('deal.updated', payload);
  }

  @OnEvent('property.created')
  async handlePropertyCreated(payload: any) {
    await this.dispatch('property.created', payload);
  }

  @OnEvent('property.updated')
  async handlePropertyUpdated(payload: any) {
    await this.dispatch('property.updated', payload);
  }

  @OnEvent('customer.created')
  async handleCustomerCreated(payload: any) {
    await this.dispatch('customer.created', payload);
  }

  @OnEvent('customer.updated')
  async handleCustomerUpdated(payload: any) {
    await this.dispatch('customer.updated', payload);
  }

  @OnEvent('appointment.created')
  async handleAppointmentCreated(payload: any) {
    await this.dispatch('appointment.created', payload);
  }

  @OnEvent('appointment.updated')
  async handleAppointmentUpdated(payload: any) {
    await this.dispatch('appointment.updated', payload);
  }

  async dispatch(eventName: string, data: any) {
    const tenantId = data.tenantId || data.projectId; // projectId is used in WebhookEndpoint
    if (!tenantId) return;

    this.logger.debug(`Dispatching event ${eventName} for tenant ${tenantId}`);

    // Find all active webhooks for this tenant that subscribe to this event (or all events '*')
    const endpoints = await this.prisma.webhookEndpoint.findMany({
      where: {
        projectId: tenantId,
        status: 'ACTIVE',
      },
    });

    const matchingEndpoints = endpoints.filter((ep) => 
      ep.events.includes('*') || ep.events.includes(eventName)
    );

    // Queue webhook deliveries
    for (const endpoint of matchingEndpoints) {
      await this.webhookQueue.add('deliver-webhook', {
        endpointId: endpoint.id,
        eventType: eventName,
        payload: {
          id: `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          type: eventName,
          created: new Date().toISOString(),
          data: data.payload,
        },
      });
    }

    // Event Sourcing: Append event to DomainEvent store
    const domainEvent = await this.prisma.domainEvent.create({
      data: {
        eventType: eventName,
        aggregateId: data.leadId || data.payload?.id || tenantId,
        aggregateType: data.aggregateType || 'System',
        payload: data.payload || data || {},
      },
    });

    // Also keep legacy event log for backward compatibility if needed, or replace it entirely.
    // Here we replace it entirely based on the new Event Sourcing & CQRS Foundation design.
  }
}
