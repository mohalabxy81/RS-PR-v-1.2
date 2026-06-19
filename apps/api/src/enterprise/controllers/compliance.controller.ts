import { CreateComplianceRecordDto, CreateRetentionPolicyDto, UpdateRetentionPolicyDto } from '../dto/enterprise.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Version, Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ComplianceService } from '../services/compliance.service';

@ApiTags('Enterprise / Compliance')
@Controller('enterprise/compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  // --- Compliance Records ---

  @RequirePermissions('enterprise.manage')
  @Get(':organizationId/records')
  async getComplianceRecords(@Param('organizationId') organizationId: string) {
    return this.complianceService.getComplianceRecords(organizationId);
  }

  @RequirePermissions('enterprise.manage')
  @Post(':organizationId/records')
  async createComplianceRecord(
    @Param('organizationId') organizationId: string,
    @Body() data: CreateComplianceRecordDto
  ) {
    return this.complianceService.createComplianceRecord(organizationId, data);
  }

  // --- Retention Policies ---

  @RequirePermissions('enterprise.manage')
  @Get(':organizationId/retention-policies')
  async getRetentionPolicies(@Param('organizationId') organizationId: string) {
    return this.complianceService.getRetentionPolicies(organizationId);
  }

  @RequirePermissions('enterprise.manage')
  @Post(':organizationId/retention-policies')
  async createRetentionPolicy(
    @Param('organizationId') organizationId: string,
    @Body() data: CreateRetentionPolicyDto
  ) {
    return this.complianceService.createRetentionPolicy(organizationId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Put('retention-policies/:policyId')
  async updateRetentionPolicy(
    @Param('policyId') policyId: string,
    @Body() data: UpdateRetentionPolicyDto
  ) {
    return this.complianceService.updateRetentionPolicy(policyId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Delete('retention-policies/:policyId')
  async deleteRetentionPolicy(@Param('policyId') policyId: string) {
    return this.complianceService.deleteRetentionPolicy(policyId);
  }
}
