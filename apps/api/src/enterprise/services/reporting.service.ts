import { CreateReportDto, UpdateReportDto } from '../dto/enterprise.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportingService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Reports ---

  async getReports(tenantId: string, organizationId: string) {
    return this.prisma.enterpriseReport.findMany({
      where: { organizationId, organization: { tenantId } },
    });
  }

  async createReport(tenantId: string, organizationId: string, data: CreateReportDto) {
    const org = await this.prisma.enterpriseOrganization.findFirst({
      where: { id: organizationId, tenantId },
    });
    if (!org) throw new NotFoundException('Organization not found');

    return this.prisma.enterpriseReport.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async updateReport(tenantId: string, reportId: string, data: UpdateReportDto) {
    const report = await this.prisma.enterpriseReport.findFirst({
      where: { id: reportId, organization: { tenantId } },
    });
    if (!report) throw new NotFoundException('Report not found');

    return this.prisma.enterpriseReport.update({
      where: { id: reportId },
      data,
    });
  }

  async deleteReport(tenantId: string, reportId: string) {
    const report = await this.prisma.enterpriseReport.findFirst({
      where: { id: reportId, organization: { tenantId } },
    });
    if (!report) throw new NotFoundException('Report not found');

    return this.prisma.enterpriseReport.delete({
      where: { id: reportId },
    });
  }

  // --- Data Exports ---

  async getDataExports(tenantId: string, organizationId: string) {
    return this.prisma.enterpriseDataExport.findMany({
      where: { organizationId, organization: { tenantId } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async requestDataExport(tenantId: string, organizationId: string, data: any) {
    const org = await this.prisma.enterpriseOrganization.findFirst({
      where: { id: organizationId, tenantId },
    });
    if (!org) throw new NotFoundException('Organization not found');

    return this.prisma.enterpriseDataExport.create({
      data: {
        ...data,
        organizationId,
        status: 'PENDING',
      },
    });
  }

  // --- Audit Exports ---

  async getAuditExports(tenantId: string, organizationId: string) {
    return this.prisma.enterpriseAuditExport.findMany({
      where: { organizationId, organization: { tenantId } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async requestAuditExport(tenantId: string, organizationId: string, data: any) {
    const org = await this.prisma.enterpriseOrganization.findFirst({
      where: { id: organizationId, tenantId },
    });
    if (!org) throw new NotFoundException('Organization not found');

    return this.prisma.enterpriseAuditExport.create({
      data: {
        ...data,
        organizationId,
        status: 'PENDING',
      },
    });
  }
}
