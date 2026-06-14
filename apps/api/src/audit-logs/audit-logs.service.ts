import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, query: any) {
    const { page = 1, limit = 50, entity, userId, action } = query;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    if (entity) where.entity = entity;
    if (userId) where.userId = userId;
    if (action) where.action = action;

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data, meta: { total, page: Number(page), limit: Number(limit) } };
  }

  // Internal method to create audit logs
  async createLog(data: {
    tenantId: string;
    userId?: string;
    action: string;
    entity: string;
    entityId: string;
    before?: any;
    after?: any;
  }) {
    return this.prisma.auditLog.create({ data });
  }
}
