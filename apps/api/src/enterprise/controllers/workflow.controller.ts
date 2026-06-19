import { CreateWorkflowDto, UpdateWorkflowDto } from '../dto/enterprise.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Version, Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { WorkflowEngineService } from '../services/workflow-engine.service';

@ApiTags('Enterprise / Workflow')
@Controller('enterprise/workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowEngineService) {}

  // --- Workflows ---

  @RequirePermissions('enterprise.manage')
  @Get('organization/:orgId')
  async getWorkflows(@Param('orgId') orgId: string) {
    return this.workflowService.getWorkflows(orgId);
  }

  @RequirePermissions('enterprise.manage')
  @Post('organization/:orgId')
  async createWorkflow(
    @Param('orgId') orgId: string,
    @Body() data: CreateWorkflowDto
  ) {
    return this.workflowService.createWorkflow(orgId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Put(':workflowId')
  async updateWorkflow(
    @Param('workflowId') workflowId: string,
    @Body() data: UpdateWorkflowDto
  ) {
    return this.workflowService.updateWorkflow(workflowId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Delete(':workflowId')
  async deleteWorkflow(@Param('workflowId') workflowId: string) {
    return this.workflowService.deleteWorkflow(workflowId);
  }

  // --- Approvals ---

  @RequirePermissions('enterprise.manage')
  @Get(':workflowId/approvals')
  async getApprovals(@Param('workflowId') workflowId: string) {
    return this.workflowService.getApprovals(workflowId);
  }

  @RequirePermissions('enterprise.manage')
  @Post(':workflowId/trigger')
  async triggerApproval(
    @Param('workflowId') workflowId: string,
    @Body() body: { entityId: string }
  ) {
    return this.workflowService.triggerApproval(workflowId, body.entityId);
  }

  @RequirePermissions('enterprise.manage')
  @Post('approvals/:approvalId/process')
  async processApproval(
    @Param('approvalId') approvalId: string,
    @Body() body: { action: 'APPROVE' | 'REJECT' | 'ESCALATE', userId: string, comment?: string }
  ) {
    return this.workflowService.processApprovalStep(approvalId, body.action, body.userId, body.comment);
  }
}
