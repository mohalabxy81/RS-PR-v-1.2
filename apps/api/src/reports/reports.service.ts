import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─────────────────────────────────────────────
  // LEAD REPORTS
  // ─────────────────────────────────────────────
  async getLeadReport(tenantId: string, query: any) {
    const { startDate, endDate, branchId } = query;
    const dateFilter = this.buildDateFilter(startDate, endDate);
    const baseWhere: any = { tenantId, ...(branchId && { branchId }), ...dateFilter };

    const [
      byStatus,
      bySource,
      byAgent,
      totalLeads,
      wonLeads,
      lostLeads,
    ] = await Promise.all([
      // Leads grouped by status
      this.prisma.lead.groupBy({
        by: ['status'],
        where: baseWhere,
        _count: { id: true },
      }),

      // Leads grouped by source
      this.prisma.lead.groupBy({
        by: ['source'],
        where: baseWhere,
        _count: { id: true },
      }),

      // Leads per agent
      this.prisma.lead.groupBy({
        by: ['assigneeId'],
        where: { ...baseWhere, assigneeId: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),

      // Total leads
      this.prisma.lead.count({ where: baseWhere }),

      // Won
      this.prisma.lead.count({ where: { ...baseWhere, status: 'WON' } }),

      // Lost
      this.prisma.lead.count({ where: { ...baseWhere, status: 'LOST' } }),
    ]);

    const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(2) : '0.00';

    return {
      summary: { totalLeads, wonLeads, lostLeads, conversionRate: `${conversionRate}%` },
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count.id })),
      bySource: bySource.map((s) => ({ source: s.source, count: s._count.id })),
      topAgents: byAgent.map((a) => ({ agentId: a.assigneeId, count: a._count.id })),
    };
  }

  // ─────────────────────────────────────────────
  // DEAL REPORTS
  // ─────────────────────────────────────────────
  async getDealReport(tenantId: string, query: any) {
    const { startDate, endDate, branchId } = query;
    const dateFilter = this.buildDateFilter(startDate, endDate);
    const baseWhere: any = { tenantId, ...dateFilter };

    const [
      byStage,
      totalRevenue,
      forecastRevenue,
      totalDeals,
      closedWon,
      closedLost,
      byAgent,
    ] = await Promise.all([
      this.prisma.deal.groupBy({
        by: ['stage'],
        where: baseWhere,
        _count: { id: true },
        _sum: { value: true },
      }),

      this.prisma.deal.aggregate({
        where: { ...baseWhere, stage: 'CLOSED_WON' },
        _sum: { value: true },
      }),

      this.prisma.deal.aggregate({
        where: { ...baseWhere, stage: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] } },
        _sum: { value: true },
      }),

      this.prisma.deal.count({ where: baseWhere }),
      this.prisma.deal.count({ where: { ...baseWhere, stage: 'CLOSED_WON' } }),
      this.prisma.deal.count({ where: { ...baseWhere, stage: 'CLOSED_LOST' } }),

      this.prisma.deal.groupBy({
        by: ['assigneeId'],
        where: { ...baseWhere, assigneeId: { not: null } },
        _count: { id: true },
        _sum: { value: true },
        orderBy: { _sum: { value: 'desc' } },
        take: 10,
      }),
    ]);

    const winRate = totalDeals > 0 ? ((closedWon / totalDeals) * 100).toFixed(2) : '0.00';

    return {
      summary: {
        totalDeals,
        closedWon,
        closedLost,
        winRate: `${winRate}%`,
        totalRevenue: totalRevenue._sum.value ?? 0,
        forecastRevenue: forecastRevenue._sum.value ?? 0,
      },
      byStage: byStage.map((s) => ({
        stage: s.stage,
        count: s._count.id,
        totalValue: s._sum.value ?? 0,
      })),
      topAgents: byAgent.map((a) => ({
        agentId: a.assigneeId,
        dealCount: a._count.id,
        totalValue: a._sum.value ?? 0,
      })),
    };
  }

  // ─────────────────────────────────────────────
  // PROPERTY REPORTS
  // ─────────────────────────────────────────────
  async getPropertyReport(tenantId: string, query: any) {
    const { startDate, endDate } = query;
    const dateFilter = this.buildDateFilter(startDate, endDate);
    const baseWhere: any = { tenantId, ...dateFilter };

    const [byType, byStatus, byListingType, totalProperties, avgPrice] = await Promise.all([
      this.prisma.property.groupBy({
        by: ['propertyType'],
        where: baseWhere,
        _count: { id: true },
      }),
      this.prisma.property.groupBy({
        by: ['status'],
        where: baseWhere,
        _count: { id: true },
      }),
      this.prisma.property.groupBy({
        by: ['listingType'],
        where: baseWhere,
        _count: { id: true },
        _avg: { price: true },
      }),
      this.prisma.property.count({ where: baseWhere }),
      this.prisma.property.aggregate({
        where: baseWhere,
        _avg: { price: true },
      }),
    ]);

    return {
      summary: {
        totalProperties,
        avgPrice: avgPrice._avg.price ?? 0,
      },
      byType: byType.map((t) => ({ type: t.propertyType, count: t._count.id })),
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count.id })),
      byListingType: byListingType.map((l) => ({
        listingType: l.listingType,
        count: l._count.id,
        avgPrice: l._avg.price ?? 0,
      })),
    };
  }

  // ─────────────────────────────────────────────
  // AGENT PERFORMANCE REPORT
  // ─────────────────────────────────────────────
  async getAgentReport(tenantId: string, query: any) {
    const { startDate, endDate, branchId } = query;
    const dateFilter = this.buildDateFilter(startDate, endDate);

    // Get all active agents in the tenant
    const agents = await this.prisma.user.findMany({
      where: { tenantId, status: 'ACTIVE', ...(branchId && { branchId }) },
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    const agentMetrics = await Promise.all(
      agents.map(async (agent) => {
        const agentDateFilter = dateFilter.createdAt
          ? { createdAt: dateFilter.createdAt }
          : {};

        const [leads, dealsWon, dealsTotal, appointments, tasks] = await Promise.all([
          this.prisma.lead.count({ where: { tenantId, assigneeId: agent.id, ...agentDateFilter } }),
          this.prisma.deal.count({ where: { tenantId, assigneeId: agent.id, stage: 'CLOSED_WON', ...agentDateFilter } }),
          this.prisma.deal.count({ where: { tenantId, assigneeId: agent.id, ...agentDateFilter } }),
          this.prisma.appointment.count({ where: { tenantId, organizerId: agent.id, ...agentDateFilter } }),
          this.prisma.task.count({ where: { tenantId, assigneeId: agent.id, status: 'COMPLETED', ...agentDateFilter } }),
        ]);

        const revenueData = await this.prisma.deal.aggregate({
          where: { tenantId, assigneeId: agent.id, stage: 'CLOSED_WON', ...agentDateFilter },
          _sum: { value: true },
        });

        return {
          agent: { id: agent.id, name: `${agent.firstName} ${agent.lastName}`, email: agent.email },
          leads,
          dealsWon,
          dealsTotal,
          winRate: dealsTotal > 0 ? `${((dealsWon / dealsTotal) * 100).toFixed(1)}%` : '0.0%',
          revenue: revenueData._sum.value ?? 0,
          appointments,
          tasksCompleted: tasks,
        };
      }),
    );

    return {
      agents: agentMetrics.sort((a, b) => b.revenue - a.revenue),
    };
  }

  // ─────────────────────────────────────────────
  // APPOINTMENT REPORTS
  // ─────────────────────────────────────────────
  async getAppointmentReport(tenantId: string, query: any) {
    const { startDate, endDate } = query;
    const dateFilter = this.buildDateFilter(startDate, endDate);
    const baseWhere: any = { tenantId, ...(dateFilter.createdAt ? { startTime: dateFilter.createdAt } : {}) };

    const [byType, byStatus, total] = await Promise.all([
      this.prisma.appointment.groupBy({
        by: ['type'],
        where: baseWhere,
        _count: { id: true },
      }),
      this.prisma.appointment.groupBy({
        by: ['status'],
        where: baseWhere,
        _count: { id: true },
      }),
      this.prisma.appointment.count({ where: baseWhere }),
    ]);

    return {
      summary: { total },
      byType: byType.map((t) => ({ type: t.type, count: t._count.id })),
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count.id })),
    };
  }

  // ─────────────────────────────────────────────
  // CSV EXPORT (simple flat format)
  // ─────────────────────────────────────────────
  async exportLeadsCsv(tenantId: string, query: any): Promise<string> {
    const { startDate, endDate } = query;
    const dateFilter = this.buildDateFilter(startDate, endDate);

    const leads = await this.prisma.lead.findMany({
      where: { tenantId, ...dateFilter },
      include: {
        assignee: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Status', 'Source', 'Budget', 'Assignee', 'Created At'];
    const rows = leads.map((l) => [
      l.id,
      l.firstName,
      l.lastName,
      l.email ?? '',
      l.phone ?? '',
      l.status,
      l.source,
      l.budget?.toString() ?? '',
      l.assignee ? `${l.assignee.firstName} ${l.assignee.lastName}` : '',
      l.createdAt.toISOString(),
    ]);

    return [headers, ...rows].map((row) => row.map(this.escapeCsv).join(',')).join('\n');
  }

  async exportDealsCsv(tenantId: string, query: any): Promise<string> {
    const { startDate, endDate } = query;
    const dateFilter = this.buildDateFilter(startDate, endDate);

    const deals = await this.prisma.deal.findMany({
      where: { tenantId, ...dateFilter },
      include: {
        assignee: { select: { firstName: true, lastName: true } },
        customer: { select: { firstName: true, lastName: true } },
        property: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const headers = ['ID', 'Title', 'Stage', 'Value', 'Currency', 'Customer', 'Property', 'Assignee', 'Forecast Close', 'Created At'];
    const rows = deals.map((d) => [
      d.id,
      d.title,
      d.stage,
      d.value.toString(),
      d.currency,
      d.customer ? `${d.customer.firstName} ${d.customer.lastName}` : '',
      d.property?.title ?? '',
      d.assignee ? `${d.assignee.firstName} ${d.assignee.lastName}` : '',
      d.forecastCloseDate?.toISOString() ?? '',
      d.createdAt.toISOString(),
    ]);

    return [headers, ...rows].map((row) => row.map(this.escapeCsv).join(',')).join('\n');
  }

  // ─────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────
  private buildDateFilter(startDate?: string, endDate?: string) {
    if (!startDate && !endDate) return {};
    const filter: any = {};
    if (startDate) filter.gte = new Date(startDate);
    if (endDate) filter.lte = new Date(endDate);
    return { createdAt: filter };
  }

  private escapeCsv(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
