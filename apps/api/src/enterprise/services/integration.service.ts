import { CreateIntegrationDto, UpdateIntegrationDto, CreateConnectorDto } from '../dto/enterprise.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IntegrationService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Integrations ---

  async getIntegrations(organizationId: string) {
    return this.prisma.enterpriseIntegration.findMany({
      where: { organizationId },
      include: { connectors: true },
    });
  }

  async createIntegration(organizationId: string, data: CreateIntegrationDto) {
    return this.prisma.enterpriseIntegration.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async updateIntegration(integrationId: string, data: UpdateIntegrationDto) {
    return this.prisma.enterpriseIntegration.update({
      where: { id: integrationId },
      data,
    });
  }

  async deleteIntegration(integrationId: string) {
    return this.prisma.enterpriseIntegration.delete({
      where: { id: integrationId },
    });
  }

  // --- Connectors ---

  async addConnector(integrationId: string, data: CreateConnectorDto) {
    return this.prisma.enterpriseConnector.create({
      data: {
        ...data,
        integrationId,
      },
    });
  }

  async updateConnector(connectorId: string, data: any) {
    return this.prisma.enterpriseConnector.update({
      where: { id: connectorId },
      data,
    });
  }

  async removeConnector(connectorId: string) {
    return this.prisma.enterpriseConnector.delete({
      where: { id: connectorId },
    });
  }
}
