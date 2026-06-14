import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WorkflowEngineService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Workflows ---

  async getWorkflows(organizationId: string) {
    return this.prisma.enterpriseWorkflow.findMany({
      where: { organizationId },
    });
  }

  async createWorkflow(organizationId: string, data: any) {
    return this.prisma.enterpriseWorkflow.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async updateWorkflow(workflowId: string, data: any) {
    return this.prisma.enterpriseWorkflow.update({
      where: { id: workflowId },
      data,
    });
  }

  async deleteWorkflow(workflowId: string) {
    return this.prisma.enterpriseWorkflow.delete({
      where: { id: workflowId },
    });
  }

  // --- Approvals ---

  async triggerApproval(workflowId: string, entityId: string) {
    return this.prisma.enterpriseApproval.create({
      data: {
        workflowId,
        entityId,
        status: 'PENDING',
        currentStep: 0,
        history: [{ action: 'STARTED', timestamp: new Date().toISOString() }],
      },
    });
  }

  async getApprovals(workflowId: string) {
    return this.prisma.enterpriseApproval.findMany({
      where: { workflowId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async processApprovalStep(approvalId: string, action: 'APPROVE' | 'REJECT' | 'ESCALATE', userId: string, comment?: string) {
    const approval = await this.prisma.enterpriseApproval.findUnique({
      where: { id: approvalId },
      include: { workflow: true }
    });

    if (!approval) throw new NotFoundException('Approval not found');

    const steps = approval.workflow.steps as any[];
    const isLastStep = approval.currentStep >= steps.length - 1;

    let newStatus = approval.status;
    let nextStep = approval.currentStep;

    if (action === 'REJECT') {
      newStatus = 'REJECTED';
    } else if (action === 'APPROVE') {
      if (isLastStep) {
        newStatus = 'APPROVED';
      } else {
        nextStep += 1;
      }
    } else if (action === 'ESCALATE') {
      newStatus = 'ESCALATED';
    }

    const history = Array.isArray(approval.history) ? approval.history : [];
    history.push({ action, step: approval.currentStep, userId, comment, timestamp: new Date().toISOString() });

    return this.prisma.enterpriseApproval.update({
      where: { id: approvalId },
      data: {
        status: newStatus,
        currentStep: nextStep,
        history,
      },
    });
  }
}
