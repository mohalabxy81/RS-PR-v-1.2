import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AiAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardMetrics(tenantId: string, userId?: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const usageWhere: any = { tenantId, createdAt: { gte: since } };
    if (userId) usageWhere.userId = userId;

    const [
      totalRequests,
      featureBreakdown,
      tokenUsage,
      totalCost,
      recentConversations,
      feedbackStats,
    ] = await Promise.all([
      // Total requests
      this.prisma.aiUsage.count({ where: usageWhere }),

      // Per-feature breakdown
      this.prisma.aiUsage.groupBy({
        by: ['feature'],
        where: usageWhere,
        _count: { feature: true },
        _sum: { totalTokens: true },
        orderBy: { _count: { feature: 'desc' } },
      }),

      // Token totals
      this.prisma.aiUsage.aggregate({
        where: usageWhere,
        _sum: { inputTokens: true, outputTokens: true, totalTokens: true },
      }),

      // Total cost
      this.prisma.aiCostTracking.aggregate({
        where: { tenantId, date: { gte: since } },
        _sum: { cost: true },
      }),

      // Recent conversations
      this.prisma.aiConversation.count({
        where: { tenantId, createdAt: { gte: since } },
      }),

      // Feedback breakdown
      this.prisma.aiFeedback.groupBy({
        by: ['isPositive'],
        where: { tenantId, createdAt: { gte: since } },
        _count: { isPositive: true },
      }),
    ]);

    // Daily usage trend
    const dailyUsage = await this.prisma.$queryRaw<any[]>`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*) as requests,
        SUM("totalTokens") as tokens
      FROM "AiUsage"
      WHERE "tenantId" = ${tenantId}
        AND "createdAt" >= ${since}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    const positiveCount = feedbackStats.find(f => f.isPositive)?._count.isPositive ?? 0;
    const negativeCount = feedbackStats.find(f => !f.isPositive)?._count.isPositive ?? 0;
    const totalFeedback = positiveCount + negativeCount;

    return {
      summary: {
        totalRequests,
        totalConversations: recentConversations,
        totalTokens: tokenUsage._sum.totalTokens ?? 0,
        inputTokens: tokenUsage._sum.inputTokens ?? 0,
        outputTokens: tokenUsage._sum.outputTokens ?? 0,
        estimatedCost: totalCost._sum.cost ?? 0,
        satisfactionRate: totalFeedback > 0 ? Math.round((positiveCount / totalFeedback) * 100) : null,
      },
      featureBreakdown: featureBreakdown.map(f => ({
        feature: f.feature,
        requests: f._count.feature,
        tokens: f._sum.totalTokens ?? 0,
      })),
      dailyUsage,
      feedback: { positive: positiveCount, negative: negativeCount, total: totalFeedback },
      period: { days, since },
    };
  }

  async getUsageByUser(tenantId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const byUser = await this.prisma.aiUsage.groupBy({
      by: ['userId'],
      where: { tenantId, createdAt: { gte: since } },
      _count: { userId: true },
      _sum: { totalTokens: true },
      orderBy: { _count: { userId: 'desc' } },
      take: 20,
    });

    // Enrich with user names
    const userIds = byUser.map(u => u.userId).filter(Boolean) as string[];
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, firstName: true, lastName: true, email: true },
    });
    const userMap = Object.fromEntries(users.map(u => [u.id, u]));

    return byUser.map(u => ({
      userId: u.userId,
      user: u.userId ? userMap[u.userId] : null,
      requests: u._count.userId,
      tokens: u._sum.totalTokens ?? 0,
    }));
  }
}
