import { CreateIntegrationDto, UpdateIntegrationDto, CreateConnectorDto } from '../dto/enterprise.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Version, Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { IntegrationService } from '../services/integration.service';

@ApiTags('Enterprise / Integration')
@Controller('enterprise/integrations')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @RequirePermissions('enterprise.manage')
  @Get(':organizationId')
  async getIntegrations(@Param('organizationId') organizationId: string) {
    return this.integrationService.getIntegrations(organizationId);
  }

  @RequirePermissions('enterprise.manage')
  @Post(':organizationId')
  async createIntegration(
    @Param('organizationId') organizationId: string,
    @Body() data: CreateIntegrationDto
  ) {
    return this.integrationService.createIntegration(organizationId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Put(':integrationId')
  async updateIntegration(
    @Param('integrationId') integrationId: string,
    @Body() data: UpdateIntegrationDto
  ) {
    return this.integrationService.updateIntegration(integrationId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Delete(':integrationId')
  async deleteIntegration(@Param('integrationId') integrationId: string) {
    return this.integrationService.deleteIntegration(integrationId);
  }

  // --- Connectors ---

  @RequirePermissions('enterprise.manage')
  @Post(':integrationId/connectors')
  async addConnector(
    @Param('integrationId') integrationId: string,
    @Body() data: CreateConnectorDto
  ) {
    return this.integrationService.addConnector(integrationId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Put('connectors/:connectorId')
  async updateConnector(
    @Param('connectorId') connectorId: string,
    @Body() data: any
  ) {
    return this.integrationService.updateConnector(connectorId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Delete('connectors/:connectorId')
  async removeConnector(@Param('connectorId') connectorId: string) {
    return this.integrationService.removeConnector(connectorId);
  }
}
