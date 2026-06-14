import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, UseGuards } from '@nestjs/common';
import { CommunicationAutomationService } from './communication-automation.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/communication/automations')
export class CommunicationAutomationController {
  constructor(private readonly service: CommunicationAutomationService) {}

  @Get()
  listRules(@Request() req: any, @Query() q: any) {
    return this.service.listRules(req.user.tenantId, +q.page || 1, +q.limit || 25);
  }

  @Post()
  createRule(@Request() req: any, @Body() body: any) {
    return this.service.createRule(req.user.tenantId, body);
  }

  @Patch(':id/toggle')
  toggleRule(@Request() req: any, @Param('id') id: string, @Body() body: { isActive: boolean }) {
    return this.service.toggleRule(req.user.tenantId, id, body.isActive);
  }

  @Delete(':id')
  deleteRule(@Request() req: any, @Param('id') id: string) {
    return this.service.deleteRule(req.user.tenantId, id);
  }

  @Get(':id/executions')
  getExecutions(@Request() req: any, @Param('id') id: string, @Query() q: any) {
    return this.service.getExecutions(req.user.tenantId, id, +q.page || 1, +q.limit || 50);
  }
}
