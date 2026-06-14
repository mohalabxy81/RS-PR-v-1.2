import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { IntegrationService } from '../services/integration.service';

@Controller('v1/enterprise/integrations')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Get(':organizationId')
  async getIntegrations(@Param('organizationId') organizationId: string) {
    return this.integrationService.getIntegrations(organizationId);
  }

  @Post(':organizationId')
  async createIntegration(
    @Param('organizationId') organizationId: string,
    @Body() data: any
  ) {
    return this.integrationService.createIntegration(organizationId, data);
  }

  @Put(':integrationId')
  async updateIntegration(
    @Param('integrationId') integrationId: string,
    @Body() data: any
  ) {
    return this.integrationService.updateIntegration(integrationId, data);
  }

  @Delete(':integrationId')
  async deleteIntegration(@Param('integrationId') integrationId: string) {
    return this.integrationService.deleteIntegration(integrationId);
  }

  // --- Connectors ---

  @Post(':integrationId/connectors')
  async addConnector(
    @Param('integrationId') integrationId: string,
    @Body() data: any
  ) {
    return this.integrationService.addConnector(integrationId, data);
  }

  @Put('connectors/:connectorId')
  async updateConnector(
    @Param('connectorId') connectorId: string,
    @Body() data: any
  ) {
    return this.integrationService.updateConnector(connectorId, data);
  }

  @Delete('connectors/:connectorId')
  async removeConnector(@Param('connectorId') connectorId: string) {
    return this.integrationService.removeConnector(connectorId);
  }
}
