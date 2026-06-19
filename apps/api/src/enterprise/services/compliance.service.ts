import { CreateComplianceRecordDto, CreateRetentionPolicyDto, UpdateRetentionPolicyDto } from '../dto/enterprise.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ComplianceService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Compliance Records ---

  async getComplianceRecords(organizationId: string) {
    return this.prisma.enterpriseComplianceRecord.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createComplianceRecord(organizationId: string, data: CreateComplianceRecordDto) {
    return this.prisma.enterpriseComplianceRecord.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  // --- Retention Policies ---

  async getRetentionPolicies(organizationId: string) {
    return this.prisma.enterpriseRetentionPolicy.findMany({
      where: { organizationId },
    });
  }

  async createRetentionPolicy(organizationId: string, data: CreateRetentionPolicyDto) {
    return this.prisma.enterpriseRetentionPolicy.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async updateRetentionPolicy(policyId: string, data: UpdateRetentionPolicyDto) {
    return this.prisma.enterpriseRetentionPolicy.update({
      where: { id: policyId },
      data,
    });
  }

  async deleteRetentionPolicy(policyId: string) {
    return this.prisma.enterpriseRetentionPolicy.delete({
      where: { id: policyId },
    });
  }
}
