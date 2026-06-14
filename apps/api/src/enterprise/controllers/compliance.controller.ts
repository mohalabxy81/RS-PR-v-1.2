import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ComplianceService } from '../services/compliance.service';

@Controller('v1/enterprise/compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  // --- Compliance Records ---

  @Get(':organizationId/records')
  async getComplianceRecords(@Param('organizationId') organizationId: string) {
    return this.complianceService.getComplianceRecords(organizationId);
  }

  @Post(':organizationId/records')
  async createComplianceRecord(
    @Param('organizationId') organizationId: string,
    @Body() data: any
  ) {
    return this.complianceService.createComplianceRecord(organizationId, data);
  }

  // --- Retention Policies ---

  @Get(':organizationId/retention-policies')
  async getRetentionPolicies(@Param('organizationId') organizationId: string) {
    return this.complianceService.getRetentionPolicies(organizationId);
  }

  @Post(':organizationId/retention-policies')
  async createRetentionPolicy(
    @Param('organizationId') organizationId: string,
    @Body() data: any
  ) {
    return this.complianceService.createRetentionPolicy(organizationId, data);
  }

  @Put('retention-policies/:policyId')
  async updateRetentionPolicy(
    @Param('policyId') policyId: string,
    @Body() data: any
  ) {
    return this.complianceService.updateRetentionPolicy(policyId, data);
  }

  @Delete('retention-policies/:policyId')
  async deleteRetentionPolicy(@Param('policyId') policyId: string) {
    return this.complianceService.deleteRetentionPolicy(policyId);
  }
}
