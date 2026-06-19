import { CreateComplianceRecordDto, CreateRetentionPolicyDto, UpdateRetentionPolicyDto } from '../dto/enterprise.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Version, Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ComplianceService } from '../services/compliance.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Enterprise / Compliance')
@Controller('enterprise/compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  // --- Compliance Records ---

  @RequirePermissions('enterprise.manage')
  @Get(':organizationId/records')
  async getComplianceRecords(
    @CurrentUser() user: CurrentUserPayload,
    @Param('organizationId') organizationId: string
  ) {
    return this.complianceService.getComplianceRecords(user.tenantId, organizationId);
  }

  @RequirePermissions('enterprise.manage')
  @Post(':organizationId/records')
  async createComplianceRecord(
    @CurrentUser() user: CurrentUserPayload,
    @Param('organizationId') organizationId: string,
    @Body() data: CreateComplianceRecordDto
  ) {
    return this.complianceService.createComplianceRecord(user.tenantId, organizationId, data);
  }

  // --- Retention Policies ---

  @RequirePermissions('enterprise.manage')
  @Get(':organizationId/retention-policies')
  async getRetentionPolicies(
    @CurrentUser() user: CurrentUserPayload,
    @Param('organizationId') organizationId: string
  ) {
    return this.complianceService.getRetentionPolicies(user.tenantId, organizationId);
  }

  @RequirePermissions('enterprise.manage')
  @Post(':organizationId/retention-policies')
  async createRetentionPolicy(
    @CurrentUser() user: CurrentUserPayload,
    @Param('organizationId') organizationId: string,
    @Body() data: CreateRetentionPolicyDto
  ) {
    return this.complianceService.createRetentionPolicy(user.tenantId, organizationId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Put('retention-policies/:policyId')
  async updateRetentionPolicy(
    @CurrentUser() user: CurrentUserPayload,
    @Param('policyId') policyId: string,
    @Body() data: UpdateRetentionPolicyDto
  ) {
    return this.complianceService.updateRetentionPolicy(user.tenantId, policyId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Delete('retention-policies/:policyId')
  async deleteRetentionPolicy(
    @CurrentUser() user: CurrentUserPayload,
    @Param('policyId') policyId: string
  ) {
    return this.complianceService.deleteRetentionPolicy(user.tenantId, policyId);
  }
}
