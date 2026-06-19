import { CreateReportDto, UpdateReportDto } from '../dto/enterprise.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportingService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Reports ---

  async getReports(organizationId: string) {
    return this.prisma.enterpriseReport.findMany({
      where: { organizationId },
    });
  }

  async createReport(organizationId: string, data: CreateReportDto) {
    return this.prisma.enterpriseReport.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async updateReport(reportId: string, data: UpdateReportDto) {
    return this.prisma.enterpriseReport.update({
      where: { id: reportId },
      data,
    });
  }

  async deleteReport(reportId: string) {
    return this.prisma.enterpriseReport.delete({
      where: { id: reportId },
    });
  }

  // --- Data Exports ---

  async getDataExports(organizationId: string) {
    return this.prisma.enterpriseDataExport.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async requestDataExport(organizationId: string, data: any) {
    return this.prisma.enterpriseDataExport.create({
      data: {
        ...data,
        organizationId,
        status: 'PENDING',
      },
    });
  }

  // --- Audit Exports ---

  async getAuditExports(organizationId: string) {
    return this.prisma.enterpriseAuditExport.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async requestAuditExport(organizationId: string, data: any) {
    return this.prisma.enterpriseAuditExport.create({
      data: {
        ...data,
        organizationId,
        status: 'PENDING',
      },
    });
  }
}
