import { CreateComplianceRecordDto, CreateRetentionPolicyDto, UpdateRetentionPolicyDto } from '../dto/enterprise.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ComplianceService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Compliance Records ---

  async getComplianceRecords(tenantId: string, organizationId: string) {
    return this.prisma.enterpriseComplianceRecord.findMany({
      where: { organizationId, organization: { tenantId } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createComplianceRecord(tenantId: string, organizationId: string, data: CreateComplianceRecordDto) {
    const org = await this.prisma.enterpriseOrganization.findFirst({
      where: { id: organizationId, tenantId },
    });
    if (!org) throw new NotFoundException('Organization not found');

    return this.prisma.enterpriseComplianceRecord.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  // --- Retention Policies ---

  async getRetentionPolicies(tenantId: string, organizationId: string) {
    return this.prisma.enterpriseRetentionPolicy.findMany({
      where: { organizationId, organization: { tenantId } },
    });
  }

  async createRetentionPolicy(tenantId: string, organizationId: string, data: CreateRetentionPolicyDto) {
    const org = await this.prisma.enterpriseOrganization.findFirst({
      where: { id: organizationId, tenantId },
    });
    if (!org) throw new NotFoundException('Organization not found');

    return this.prisma.enterpriseRetentionPolicy.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async updateRetentionPolicy(tenantId: string, policyId: string, data: UpdateRetentionPolicyDto) {
    const policy = await this.prisma.enterpriseRetentionPolicy.findFirst({
      where: { id: policyId, organization: { tenantId } },
    });
    if (!policy) throw new NotFoundException('Retention Policy not found');

    return this.prisma.enterpriseRetentionPolicy.update({
      where: { id: policyId },
      data,
    });
  }

  async deleteRetentionPolicy(tenantId: string, policyId: string) {
    const policy = await this.prisma.enterpriseRetentionPolicy.findFirst({
      where: { id: policyId, organization: { tenantId } },
    });
    if (!policy) throw new NotFoundException('Retention Policy not found');

    return this.prisma.enterpriseRetentionPolicy.delete({
      where: { id: policyId },
    });
  }
}
