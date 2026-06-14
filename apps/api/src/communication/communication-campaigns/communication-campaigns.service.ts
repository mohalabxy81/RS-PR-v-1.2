import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class CommunicationCampaignsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('campaigns') private campaignsQueue: Queue,
  ) {}

  async list(tenantId: string, page = 1, limit = 25) {
    const skip = (page - 1) * limit;
    const [campaigns, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where: { tenantId },
        include: {
          results: true,
          _count: { select: { contacts: true, messages: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.campaign.count({ where: { tenantId } }),
    ]);
    return { campaigns, total, page, limit };
  }

  async findOne(tenantId: string, id: string) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id, tenantId },
      include: {
        results: true,
        contacts: { include: { contact: true }, take: 100 },
        _count: { select: { contacts: true, messages: true } },
      },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async create(tenantId: string, data: {
    name: string;
    description?: string;
    scheduledAt?: string;
    metadata?: any;
  }) {
    return this.prisma.campaign.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
        status: 'DRAFT',
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        metadata: data.metadata,
      },
    });
  }

  async updateStatus(tenantId: string, id: string, status: string) {
    await this.findOne(tenantId, id);
    const campaign = await this.prisma.campaign.update({
      where: { id },
      data: { status: status as any },
    });

    // If launching, enqueue processing
    if (status === 'RUNNING') {
      await this.campaignsQueue.add('process-campaign', {
        campaignId: id,
        tenantId,
      }, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      });
    }

    return campaign;
  }

  async addContacts(tenantId: string, id: string, contactIds: string[]) {
    await this.findOne(tenantId, id);
    const data = contactIds.map(contactId => ({ campaignId: id, contactId, status: 'PENDING' }));
    await this.prisma.campaignContact.createMany({ data, skipDuplicates: true });
    return { added: data.length };
  }

  async getAnalytics(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    const results = await this.prisma.campaignResult.findMany({ where: { campaignId: id } });
    const totalContacts = await this.prisma.campaignContact.count({ where: { campaignId: id } });

    const metrics: Record<string, number> = {};
    for (const r of results) {
      metrics[r.metric] = r.count;
    }

    return {
      totalContacts,
      metrics,
      deliveryRate: totalContacts > 0 ? (metrics['DELIVERED'] ?? 0) / totalContacts : 0,
      readRate: totalContacts > 0 ? (metrics['READ'] ?? 0) / totalContacts : 0,
      replyRate: totalContacts > 0 ? (metrics['REPLIED'] ?? 0) / totalContacts : 0,
    };
  }
}
