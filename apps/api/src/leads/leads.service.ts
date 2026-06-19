import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivitiesService } from '../activities/activities.service';
import { CreateLeadDto, UpdateLeadDto, QueryLeadDto } from './dto/lead.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activities: ActivitiesService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(tenantId: string, createdById: string, dto: CreateLeadDto) {
    const { tags, ...data } = dto;

    const lead = await this.prisma.lead.create({
      data: {
        ...data,
        tenantId,
        createdById,
        leadTags: tags ? { create: tags.map((tag) => ({ tag })) } : undefined,
      },
    });

    await this.activities.track({
      tenantId,
      userId: createdById,
      entityType: 'Lead',
      entityId: lead.id,
      action: 'created',
      description: `Lead ${lead.firstName} ${lead.lastName} was created`,
    });

    this.eventEmitter.emit('lead.created', {
      tenantId,
      leadId: lead.id,
      payload: lead,
    });

    return lead;
  }

  async findAll(tenantId: string, query: QueryLeadDto) {
    const { page = 1, limit = 20, status, assigneeId, isArchived, search, source } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { tenantId, isArchived: isArchived === 'true' };
    if (status) where.status = status;
    if (assigneeId) where.assigneeId = assigneeId;
    if (source) where.source = source;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          assignee: { select: { id: true, firstName: true, lastName: true } },
          leadTags: { select: { tag: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.lead.count({ where }),
    ]);

    return { data, meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } };
  }

  async findOne(tenantId: string, id: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, tenantId },
      include: {
        assignee: { select: { id: true, firstName: true, lastName: true } },
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        leadTags: { select: { tag: true } },
        leadNotes: {
          include: { author: { select: { id: true, firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
        },
        deals: { select: { id: true, title: true, value: true, stage: true } },
        appointments: {
          select: { id: true, title: true, type: true, startTime: true, status: true },
          orderBy: { startTime: 'desc' },
          take: 5,
        },
      },
    });

    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async update(tenantId: string, id: string, dto: UpdateLeadDto, updatedById?: string) {
    const lead = await this.prisma.lead.findFirst({ where: { id, tenantId } });
    if (!lead) throw new NotFoundException('Lead not found');

    const updated = await this.prisma.lead.update({
      where: { id },
      data: dto,
    });

    if (dto.status && dto.status !== lead.status) {
      await this.activities.track({
        tenantId,
        userId: updatedById,
        entityType: 'Lead',
        entityId: id,
        action: 'status_changed',
        description: `Lead status changed from ${lead.status} to ${dto.status}`,
        metadata: { from: lead.status, to: dto.status },
      });
    } else if (updatedById) {
      await this.activities.track({
        tenantId,
        userId: updatedById,
        entityType: 'Lead',
        entityId: id,
        action: 'updated',
        description: `Lead ${lead.firstName} ${lead.lastName} was updated`,
      });
    }

    this.eventEmitter.emit('lead.updated', {
      tenantId,
      leadId: lead.id,
      payload: updated,
    });

    return updated;
  }

  async archive(tenantId: string, id: string) {
    const lead = await this.prisma.lead.findFirst({ where: { id, tenantId } });
    if (!lead) throw new NotFoundException('Lead not found');

    return this.prisma.lead.update({
      where: { id },
      data: { isArchived: true, status: 'ARCHIVED' },
    });
  }

  async addNote(tenantId: string, leadId: string, authorId: string, content: string) {
    const lead = await this.prisma.lead.findFirst({ where: { id: leadId, tenantId } });
    if (!lead) throw new NotFoundException('Lead not found');

    const note = await this.prisma.leadNote.create({
      data: { leadId, authorId, content },
      include: { author: { select: { id: true, firstName: true, lastName: true } } },
    });

    await this.activities.track({
      tenantId,
      userId: authorId,
      entityType: 'Lead',
      entityId: leadId,
      action: 'note_added',
      description: 'A note was added to the lead',
    });

    return note;
  }

  async assign(tenantId: string, id: string, assigneeId: string | null, assignedById?: string) {
    const lead = await this.prisma.lead.findFirst({ where: { id, tenantId } });
    if (!lead) throw new NotFoundException('Lead not found');

    const updated = await this.prisma.lead.update({
      where: { id },
      data: { assigneeId },
    });

    await this.activities.track({
      tenantId,
      userId: assignedById,
      entityType: 'Lead',
      entityId: id,
      action: 'assigned',
      description: assigneeId ? `Lead was assigned to agent ${assigneeId}` : 'Lead was unassigned',
      metadata: { assigneeId },
    });

    return updated;
  }

  async getTimeline(tenantId: string, leadId: string) {
    const lead = await this.prisma.lead.findFirst({ where: { id: leadId, tenantId } });
    if (!lead) throw new NotFoundException('Lead not found');

    return this.prisma.activity.findMany({
      where: { tenantId, entityType: 'Lead', entityId: leadId },
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
