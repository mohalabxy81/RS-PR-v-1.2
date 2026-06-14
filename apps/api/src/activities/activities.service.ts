import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

interface TrackActivityParams {
  tenantId: string;
  userId?: string;
  entityType: string;
  entityId: string;
  action: string;
  description?: string;
  metadata?: Prisma.InputJsonValue;
  leadId?: string;
}

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Public tracker method — called by all services to record activities.
   * Non-blocking by design: errors are silently swallowed so activity tracking
   * never breaks the primary business operation.
   */
  async track(params: TrackActivityParams): Promise<void> {
    try {
      await this.prisma.activity.create({ data: params });
    } catch (err) {
      // Activity tracking must never crash the calling service
      console.warn('[ActivitiesService] Failed to track activity:', err);
    }
  }

  async findAll(tenantId: string, query: any) {
    const { entityType, entityId, userId, limit = 50, page = 1 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { tenantId };
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (userId) where.userId = userId;

    const [data, total] = await Promise.all([
      this.prisma.activity.findMany({
        where,
        include: {
          user: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      this.prisma.activity.count({ where }),
    ]);

    return {
      data,
      meta: { total, page: Number(page), limit: Number(limit) },
    };
  }
}
