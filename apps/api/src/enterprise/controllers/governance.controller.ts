import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { GovernanceService } from '../services/governance.service';

@Controller('v1/enterprise/governance')
export class GovernanceController {
  constructor(private readonly governanceService: GovernanceService) {}

  // --- Policies ---

  @Get(':organizationId/policies')
  async getPolicies(@Param('organizationId') organizationId: string) {
    return this.governanceService.getPolicies(organizationId);
  }

  @Post(':organizationId/policies')
  async createPolicy(
    @Param('organizationId') organizationId: string,
    @Body() data: any
  ) {
    return this.governanceService.createPolicy(organizationId, data);
  }

  @Put('policies/:policyId')
  async updatePolicy(
    @Param('policyId') policyId: string,
    @Body() data: any
  ) {
    return this.governanceService.updatePolicy(policyId, data);
  }

  @Delete('policies/:policyId')
  async deletePolicy(@Param('policyId') policyId: string) {
    return this.governanceService.deletePolicy(policyId);
  }

  // --- Governance Rules ---

  @Post('policies/:policyId/rules')
  async addRuleToPolicy(
    @Param('policyId') policyId: string,
    @Body() data: any
  ) {
    return this.governanceService.addRuleToPolicy(policyId, data);
  }

  @Put('rules/:ruleId')
  async updateRule(
    @Param('ruleId') ruleId: string,
    @Body() data: any
  ) {
    return this.governanceService.updateRule(ruleId, data);
  }

  @Delete('rules/:ruleId')
  async removeRule(@Param('ruleId') ruleId: string) {
    return this.governanceService.removeRule(ruleId);
  }
}
