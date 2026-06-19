import { CreatePolicyDto, UpdatePolicyDto, CreateGovernanceRuleDto, UpdateGovernanceRuleDto } from '../dto/enterprise.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GovernanceService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Policies ---

  async getPolicies(organizationId: string) {
    return this.prisma.enterprisePolicy.findMany({
      where: { organizationId },
      include: { governanceRules: true },
    });
  }

  async createPolicy(organizationId: string, data: CreatePolicyDto) {
    return this.prisma.enterprisePolicy.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async updatePolicy(policyId: string, data: UpdatePolicyDto) {
    return this.prisma.enterprisePolicy.update({
      where: { id: policyId },
      data,
    });
  }

  async deletePolicy(policyId: string) {
    return this.prisma.enterprisePolicy.delete({
      where: { id: policyId },
    });
  }

  // --- Governance Rules ---

  async addRuleToPolicy(policyId: string, data: CreateGovernanceRuleDto) {
    return this.prisma.enterpriseGovernanceRule.create({
      data: {
        ...data,
        policyId,
      },
    });
  }

  async updateRule(ruleId: string, data: UpdateGovernanceRuleDto) {
    return this.prisma.enterpriseGovernanceRule.update({
      where: { id: ruleId },
      data,
    });
  }

  async removeRule(ruleId: string) {
    return this.prisma.enterpriseGovernanceRule.delete({
      where: { id: ruleId },
    });
  }
}
