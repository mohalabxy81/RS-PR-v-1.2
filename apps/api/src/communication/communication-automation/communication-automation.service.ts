import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class CommunicationAutomationService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('automations') private automationsQueue: Queue,
  ) {}

  async listRules(tenantId: string, page = 1, limit = 25) {
    const skip = (page - 1) * limit;
    const [rules, total] = await Promise.all([
      this.prisma.automationRule.findMany({
        where: { tenantId },
        include: {
          triggers: true,
          actions: { orderBy: { order: 'asc' } },
          _count: { select: { executions: true } },
        },
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.automationRule.count({ where: { tenantId } }),
    ]);
    return { rules, total, page, limit };
  }

  async createRule(tenantId: string, data: {
    name: string;
    description?: string;
    priority?: number;
    triggers: Array<{ type: string; config: any }>;
    actions: Array<{ type: string; config: any; order?: number }>;
  }) {
    return this.prisma.automationRule.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
        priority: data.priority ?? 0,
        isActive: true,
        triggers: {
          create: data.triggers.map(t => ({ type: t.type, config: t.config })),
        },
        actions: {
          create: data.actions.map((a, idx) => ({
            type: a.type,
            config: a.config,
            order: a.order ?? idx,
          })),
        },
      },
      include: { triggers: true, actions: true },
    });
  }

  async toggleRule(tenantId: string, id: string, isActive: boolean) {
    return this.prisma.automationRule.updateMany({
      where: { id, tenantId },
      data: { isActive },
    });
  }

  async deleteRule(tenantId: string, id: string) {
    return this.prisma.automationRule.deleteMany({ where: { id, tenantId } });
  }

  /**
   * Entry point called by event emitters or queue processors.
   * Checks all active rules for matching triggers and executes actions.
   */
  async processEvent(tenantId: string, eventType: string, eventPayload: any) {
    const rules = await this.prisma.automationRule.findMany({
      where: { tenantId, isActive: true },
      include: { triggers: true, actions: { orderBy: { order: 'asc' } } },
      orderBy: { priority: 'desc' },
    });

    for (const rule of rules) {
      const matchingTrigger = rule.triggers.find(t => t.type === eventType);
      if (!matchingTrigger) continue;

      await this.automationsQueue.add('execute-rule', {
        ruleId: rule.id,
        tenantId,
        eventPayload,
        actions: rule.actions,
      }, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 3000 },
      });
    }
  }

  async getExecutions(tenantId: string, ruleId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [executions, total] = await Promise.all([
      this.prisma.automationExecution.findMany({
        where: { ruleId, rule: { tenantId } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.automationExecution.count({ where: { ruleId } }),
    ]);
    return { executions, total, page, limit };
  }
}
