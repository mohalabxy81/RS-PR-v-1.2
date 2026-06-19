import { CreatePolicyDto, UpdatePolicyDto, CreateGovernanceRuleDto, UpdateGovernanceRuleDto } from '../dto/enterprise.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Version, Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { GovernanceService } from '../services/governance.service';

@ApiTags('Enterprise / Governance')
@Controller('enterprise/governance')
export class GovernanceController {
  constructor(private readonly governanceService: GovernanceService) {}

  // --- Policies ---

  @RequirePermissions('enterprise.manage')
  @Get(':organizationId/policies')
  async getPolicies(@Param('organizationId') organizationId: string) {
    return this.governanceService.getPolicies(organizationId);
  }

  @RequirePermissions('enterprise.manage')
  @Post(':organizationId/policies')
  async createPolicy(
    @Param('organizationId') organizationId: string,
    @Body() data: CreatePolicyDto
  ) {
    return this.governanceService.createPolicy(organizationId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Put('policies/:policyId')
  async updatePolicy(
    @Param('policyId') policyId: string,
    @Body() data: UpdatePolicyDto
  ) {
    return this.governanceService.updatePolicy(policyId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Delete('policies/:policyId')
  async deletePolicy(@Param('policyId') policyId: string) {
    return this.governanceService.deletePolicy(policyId);
  }

  // --- Governance Rules ---

  @RequirePermissions('enterprise.manage')
  @Post('policies/:policyId/rules')
  async addRuleToPolicy(
    @Param('policyId') policyId: string,
    @Body() data: CreateGovernanceRuleDto
  ) {
    return this.governanceService.addRuleToPolicy(policyId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Put('rules/:ruleId')
  async updateRule(
    @Param('ruleId') ruleId: string,
    @Body() data: UpdateGovernanceRuleDto
  ) {
    return this.governanceService.updateRule(ruleId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Delete('rules/:ruleId')
  async removeRule(@Param('ruleId') ruleId: string) {
    return this.governanceService.removeRule(ruleId);
  }
}
