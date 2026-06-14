import { Controller, Get, Post, Patch, Param, Body, Query, Request, UseGuards } from '@nestjs/common';
import { CommunicationCampaignsService } from './communication-campaigns.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/communication/campaigns')
export class CommunicationCampaignsController {
  constructor(private readonly service: CommunicationCampaignsService) {}

  @Get()
  list(@Request() req: any, @Query() q: any) {
    return this.service.list(req.user.tenantId, +q.page || 1, +q.limit || 25);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.service.findOne(req.user.tenantId, id);
  }

  @Post()
  create(@Request() req: any, @Body() body: any) {
    return this.service.create(req.user.tenantId, body);
  }

  @Patch(':id/status')
  updateStatus(@Request() req: any, @Param('id') id: string, @Body() body: { status: string }) {
    return this.service.updateStatus(req.user.tenantId, id, body.status);
  }

  @Post(':id/contacts')
  addContacts(@Request() req: any, @Param('id') id: string, @Body() body: { contactIds: string[] }) {
    return this.service.addContacts(req.user.tenantId, id, body.contactIds);
  }

  @Get(':id/analytics')
  getAnalytics(@Request() req: any, @Param('id') id: string) {
    return this.service.getAnalytics(req.user.tenantId, id);
  }
}
