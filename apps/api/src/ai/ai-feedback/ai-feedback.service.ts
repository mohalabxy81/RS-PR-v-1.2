import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AiFeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async submitFeedback(data: {
    tenantId: string;
    userId: string;
    responseId?: string;
    isPositive: boolean;
    comments?: string;
  }) {
    return this.prisma.aiFeedback.create({ data });
  }

  async getFeedback(tenantId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.aiFeedback.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { user: { select: { firstName: true, lastName: true } } },
      }),
      this.prisma.aiFeedback.count({ where: { tenantId } }),
    ]);
    return { items, total, page, limit };
  }
}
