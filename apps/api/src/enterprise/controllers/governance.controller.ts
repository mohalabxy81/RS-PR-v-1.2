import { CreatePolicyDto, UpdatePolicyDto, CreateGovernanceRuleDto, UpdateGovernanceRuleDto } from '../dto/enterprise.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Version, Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { GovernanceService } from '../services/governance.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Enterprise / Governance')
@Controller('enterprise/governance')
export class GovernanceController {
  constructor(private readonly governanceService: GovernanceService) {}

  // --- Policies ---

  @RequirePermissions('enterprise.manage')
  @Get(':organizationId/policies')
  async getPolicies(
    @CurrentUser() user: CurrentUserPayload,
    @Param('organizationId') organizationId: string
  ) {
    return this.governanceService.getPolicies(user.tenantId, organizationId);
  }

  @RequirePermissions('enterprise.manage')
  @Post(':organizationId/policies')
  async createPolicy(
    @CurrentUser() user: CurrentUserPayload,
    @Param('organizationId') organizationId: string,
    @Body() data: CreatePolicyDto
  ) {
    return this.governanceService.createPolicy(user.tenantId, organizationId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Put('policies/:policyId')
  async updatePolicy(
    @CurrentUser() user: CurrentUserPayload,
    @Param('policyId') policyId: string,
    @Body() data: UpdatePolicyDto
  ) {
    return this.governanceService.updatePolicy(user.tenantId, policyId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Delete('policies/:policyId')
  async deletePolicy(
    @CurrentUser() user: CurrentUserPayload,
    @Param('policyId') policyId: string
  ) {
    return this.governanceService.deletePolicy(user.tenantId, policyId);
  }

  // --- Governance Rules ---

  @RequirePermissions('enterprise.manage')
  @Post('policies/:policyId/rules')
  async addRuleToPolicy(
    @CurrentUser() user: CurrentUserPayload,
    @Param('policyId') policyId: string,
    @Body() data: CreateGovernanceRuleDto
  ) {
    return this.governanceService.addRuleToPolicy(user.tenantId, policyId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Put('rules/:ruleId')
  async updateRule(
    @CurrentUser() user: CurrentUserPayload,
    @Param('ruleId') ruleId: string,
    @Body() data: UpdateGovernanceRuleDto
  ) {
    return this.governanceService.updateRule(user.tenantId, ruleId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Delete('rules/:ruleId')
  async removeRule(
    @CurrentUser() user: CurrentUserPayload,
    @Param('ruleId') ruleId: string
  ) {
    return this.governanceService.removeRule(user.tenantId, ruleId);
  }
}
