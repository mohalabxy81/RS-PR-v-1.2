import { Controller, Get, Post, Patch, Param, Body, Query, Request, UseGuards } from '@nestjs/common';
import { CommunicationConversationsService } from './communication-conversations.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/communication/conversations')
export class CommunicationConversationsController {
  constructor(private readonly service: CommunicationConversationsService) {}

  @Get()
  list(@Request() req: any, @Query() query: any) {
    return this.service.list(req.user.tenantId, {
      status: query.status,
      assigneeId: query.assigneeId,
      search: query.search,
      page: query.page ? +query.page : 1,
      limit: query.limit ? +query.limit : 25,
    });
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.service.findOne(req.user.tenantId, id);
  }

  @Get(':id/messages')
  getMessages(
    @Request() req: any,
    @Param('id') id: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.service.getMessages(req.user.tenantId, id, +page || 1, +limit || 50);
  }

  @Post(':id/messages')
  sendMessage(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.service.sendMessage(req.user.tenantId, id, req.user.id, body);
  }

  @Patch(':id/assign')
  assign(@Request() req: any, @Param('id') id: string, @Body() body: { assigneeId: string | null }) {
    return this.service.assign(req.user.tenantId, id, body.assigneeId);
  }

  @Patch(':id/status')
  updateStatus(@Request() req: any, @Param('id') id: string, @Body() body: { status: string }) {
    return this.service.updateStatus(req.user.tenantId, id, body.status);
  }

  @Post(':id/labels')
  addLabel(@Request() req: any, @Param('id') id: string, @Body() body: { name: string; color?: string }) {
    return this.service.addLabel(req.user.tenantId, id, body.name, body.color);
  }

  @Patch(':id/labels/:labelId/remove')
  removeLabel(@Request() req: any, @Param('id') id: string, @Param('labelId') labelId: string) {
    return this.service.removeLabel(req.user.tenantId, id, labelId);
  }
}
