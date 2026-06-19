import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivitiesService } from '../activities/activities.service';
import { CreateDealDto, UpdateDealDto, AddDealNoteDto, QueryDealDto } from './dto/deal.dto';
import { DealStage } from '@prisma/client';

@Injectable()
export class DealsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activities: ActivitiesService,
  ) {}

  async create(tenantId: string, userId: string, dto: CreateDealDto) {
    const deal = await this.prisma.deal.create({
      data: { ...dto, tenantId, assigneeId: dto.assigneeId ?? userId },
    });

    await this.activities.track({
      tenantId,
      userId,
      entityType: 'Deal',
      entityId: deal.id,
      action: 'created',
      description: `Deal "${deal.title}" was created`,
    });

    return deal;
  }

  async findAll(tenantId: string, query: QueryDealDto) {
    const { stage, assigneeId, search } = query;

    const where: any = { tenantId };
    if (stage) where.stage = stage;
    if (assigneeId) where.assigneeId = assigneeId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.deal.findMany({
      where,
      include: {
        customer: { select: { id: true, firstName: true, lastName: true } },
        assignee: { select: { id: true, firstName: true, lastName: true } },
        property: { select: { id: true, title: true } },
        lead: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const deal = await this.prisma.deal.findFirst({
      where: { id, tenantId },
      include: {
        customer: { select: { id: true, firstName: true, lastName: true } },
        assignee: { select: { id: true, firstName: true, lastName: true } },
        property: { select: { id: true, title: true } },
        lead: { select: { id: true, firstName: true, lastName: true } },
        dealNotes: {
          include: { author: { select: { id: true, firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
        },
        stageHistory: { orderBy: { changedAt: 'desc' } },
        appointments: {
          select: { id: true, title: true, type: true, startTime: true, status: true },
          orderBy: { startTime: 'desc' },
        },
      },
    });

    if (!deal) throw new NotFoundException('Deal not found');
    return deal;
  }

  async update(tenantId: string, id: string, dto: UpdateDealDto, userId?: string) {
    const deal = await this.prisma.deal.findFirst({ where: { id, tenantId } });
    if (!deal) throw new NotFoundException('Deal not found');

    const updated = await this.prisma.deal.update({
      where: { id },
      data: dto,
    });

    if (userId) {
      await this.activities.track({
        tenantId,
        userId,
        entityType: 'Deal',
        entityId: id,
        action: 'updated',
        description: `Deal "${deal.title}" was updated`,
      });
    }

    return updated;
  }

  async updateStage(tenantId: string, id: string, userId: string, stage: DealStage) {
    const deal = await this.prisma.deal.findFirst({ where: { id, tenantId } });
    if (!deal) throw new NotFoundException('Deal not found');

    if (deal.stage === stage) return deal;

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.dealStageHistory.create({
        data: {
          dealId: id,
          fromStage: deal.stage as DealStage,
          toStage: stage,
          changedBy: userId,
        },
      });

      return tx.deal.update({
        where: { id },
        data: { stage },
      });
    });

    await this.activities.track({
      tenantId,
      userId,
      entityType: 'Deal',
      entityId: id,
      action: 'stage_changed',
      description: `Deal stage changed from ${deal.stage} to ${stage}`,
      metadata: { from: deal.stage, to: stage },
    });

    return updated;
  }

  async addNote(tenantId: string, dealId: string, authorId: string, content: string) {
    const deal = await this.prisma.deal.findFirst({ where: { id: dealId, tenantId } });
    if (!deal) throw new NotFoundException('Deal not found');

    const note = await this.prisma.dealNote.create({
      data: { dealId, authorId, content },
      include: { author: { select: { id: true, firstName: true, lastName: true } } },
    });

    await this.activities.track({
      tenantId,
      userId: authorId,
      entityType: 'Deal',
      entityId: dealId,
      action: 'note_added',
      description: 'A note was added to the deal',
    });

    return note;
  }
}
