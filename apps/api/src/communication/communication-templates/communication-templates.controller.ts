import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Request, UseGuards } from '@nestjs/common';
import { CommunicationTemplatesService } from './communication-templates.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/communication/templates')
export class CommunicationTemplatesController {
  constructor(private readonly service: CommunicationTemplatesService) {}

  @Get()
  list(@Request() req: any, @Query() query: any) {
    return this.service.list(req.user.tenantId, {
      status: query.status,
      category: query.category,
      page: query.page ? +query.page : 1,
      limit: query.limit ? +query.limit : 25,
    });
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.service.findOne(req.user.tenantId, id);
  }

  @Post()
  create(@Request() req: any, @Body() body: any) {
    return this.service.create(req.user.tenantId, body);
  }

  @Post(':id/versions')
  addVersion(@Request() req: any, @Param('id') id: string, @Body() body: { components: any[] }) {
    return this.service.addVersion(req.user.tenantId, id, body.components);
  }

  @Patch(':id/status')
  updateStatus(@Request() req: any, @Param('id') id: string, @Body() body: { status: string }) {
    return this.service.updateStatus(req.user.tenantId, id, body.status);
  }

  @Delete(':id')
  delete(@Request() req: any, @Param('id') id: string) {
    return this.service.delete(req.user.tenantId, id);
  }
}
