import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics(tenantId: string, userId: string, roleName?: string) {
    // Agent Dashboard
    if (roleName === 'Agent') {
      const [leads, appointments, tasks, properties, deals] = await Promise.all([
        this.prisma.lead.count({ where: { tenantId, assigneeId: userId, isArchived: false } }),
        this.prisma.appointment.count({
          where: { tenantId, organizerId: userId, startTime: { gte: new Date() } },
        }),
        this.prisma.task.count({ where: { tenantId, assigneeId: userId, status: { not: 'COMPLETED' } } }),
        this.prisma.property.count({ where: { tenantId, agentId: userId, status: 'AVAILABLE' } }),
        this.prisma.deal.count({ where: { tenantId, assigneeId: userId, stage: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] } } }),
      ]);
      return { type: 'agent', leads, appointments, tasks, properties, deals };
    }

    // Branch Manager / Company Owner Dashboard
    const [totalLeads, openDeals, revenueData, activeAgents, activeProperties] = await Promise.all([
      this.prisma.lead.count({ where: { tenantId, isArchived: false } }),
      this.prisma.deal.count({ where: { tenantId, stage: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] } } }),
      this.prisma.deal.aggregate({
        where: { tenantId, stage: 'CLOSED_WON' },
        _sum: { value: true },
      }),
      this.prisma.user.count({ where: { tenantId, status: 'ACTIVE' } }),
      this.prisma.property.count({ where: { tenantId, status: 'AVAILABLE' } }),
    ]);

    return {
      type: roleName === 'Company Owner' ? 'owner' : 'manager',
      totalLeads,
      openDeals,
      totalRevenue: revenueData._sum.value || 0,
      activeAgents,
      activeProperties,
    };
  }

  async getRecentActivities(tenantId: string, limit: number = 10) {
    return this.prisma.activity.findMany({
      where: { tenantId },
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
