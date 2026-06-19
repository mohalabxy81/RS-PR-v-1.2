import { CreatePolicyDto, UpdatePolicyDto, CreateGovernanceRuleDto, UpdateGovernanceRuleDto } from '../dto/enterprise.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GovernanceService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Policies ---

  async getPolicies(tenantId: string, organizationId: string) {
    return this.prisma.enterprisePolicy.findMany({
      where: { organizationId, organization: { tenantId } },
      include: { governanceRules: true },
    });
  }

  async createPolicy(tenantId: string, organizationId: string, data: CreatePolicyDto) {
    const org = await this.prisma.enterpriseOrganization.findFirst({
      where: { id: organizationId, tenantId },
    });
    if (!org) throw new NotFoundException('Organization not found');

    return this.prisma.enterprisePolicy.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async updatePolicy(tenantId: string, policyId: string, data: UpdatePolicyDto) {
    const policy = await this.prisma.enterprisePolicy.findFirst({
      where: { id: policyId, organization: { tenantId } },
    });
    if (!policy) throw new NotFoundException('Policy not found');

    return this.prisma.enterprisePolicy.update({
      where: { id: policyId },
      data,
    });
  }

  async deletePolicy(tenantId: string, policyId: string) {
    const policy = await this.prisma.enterprisePolicy.findFirst({
      where: { id: policyId, organization: { tenantId } },
    });
    if (!policy) throw new NotFoundException('Policy not found');

    return this.prisma.enterprisePolicy.delete({
      where: { id: policyId },
    });
  }

  // --- Governance Rules ---

  async addRuleToPolicy(tenantId: string, policyId: string, data: CreateGovernanceRuleDto) {
    const policy = await this.prisma.enterprisePolicy.findFirst({
      where: { id: policyId, organization: { tenantId } },
    });
    if (!policy) throw new NotFoundException('Policy not found');

    return this.prisma.enterpriseGovernanceRule.create({
      data: {
        ...data,
        policyId,
      },
    });
  }

  async updateRule(tenantId: string, ruleId: string, data: UpdateGovernanceRuleDto) {
    const rule = await this.prisma.enterpriseGovernanceRule.findFirst({
      where: { id: ruleId, policy: { organization: { tenantId } } },
    });
    if (!rule) throw new NotFoundException('Rule not found');

    return this.prisma.enterpriseGovernanceRule.update({
      where: { id: ruleId },
      data,
    });
  }

  async removeRule(tenantId: string, ruleId: string) {
    const rule = await this.prisma.enterpriseGovernanceRule.findFirst({
      where: { id: ruleId, policy: { organization: { tenantId } } },
    });
    if (!rule) throw new NotFoundException('Rule not found');

    return this.prisma.enterpriseGovernanceRule.delete({
      where: { id: ruleId },
    });
  }
}
