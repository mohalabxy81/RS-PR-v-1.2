import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SecurityService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Security Events ---

  async logSecurityEvent(organizationId: string, data: any) {
    return this.prisma.enterpriseSecurityEvent.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async getSecurityEvents(organizationId: string) {
    return this.prisma.enterpriseSecurityEvent.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // --- Risk Events ---

  async logRiskEvent(organizationId: string, data: any) {
    return this.prisma.enterpriseRiskEvent.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async getRiskEvents(organizationId: string) {
    return this.prisma.enterpriseRiskEvent.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // --- Incidents ---

  async createIncident(organizationId: string, data: any) {
    return this.prisma.enterpriseIncident.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async getIncidents(organizationId: string) {
    return this.prisma.enterpriseIncident.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async resolveIncident(incidentId: string) {
    return this.prisma.enterpriseIncident.update({
      where: { id: incidentId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    });
  }

  // --- Administrators ---

  async addAdministrator(organizationId: string, data: any) {
    return this.prisma.enterpriseAdministrator.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async getAdministrators(organizationId: string) {
    return this.prisma.enterpriseAdministrator.findMany({
      where: { organizationId },
    });
  }

  // --- Access Reviews ---

  async createAccessReview(organizationId: string, data: any) {
    return this.prisma.enterpriseAccessReview.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async getAccessReviews(organizationId: string) {
    return this.prisma.enterpriseAccessReview.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
