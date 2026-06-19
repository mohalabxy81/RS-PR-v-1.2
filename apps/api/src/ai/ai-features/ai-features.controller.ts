import { Version, Controller, Post, Body, Param, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AiFeaturesService } from './ai-features.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('AI Features')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Version('1')
@Controller('ai')
export class AiFeaturesController {
  constructor(private readonly aiFeaturesService: AiFeaturesService) {}

  @Post('generate/property-description')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate AI property descriptions in multiple formats' })
  async generatePropertyDescription(
    @Body() body: { propertyId: string; formats?: string[] },
    @Request() req: any,
  ) {
    return this.aiFeaturesService.generatePropertyDescription(
      body.propertyId, req.user.tenantId, req.user.id, body.formats,
    );
  }

  @Post('generate/property-seo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate SEO content for a property' })
  async generatePropertySeo(@Body() body: { propertyId: string }, @Request() req: any) {
    return this.aiFeaturesService.generatePropertySeo(body.propertyId, req.user.tenantId, req.user.id);
  }

  @Post('score/lead/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'AI-powered lead scoring with recommendations' })
  async scoreLead(@Param('id') id: string, @Request() req: any) {
    return this.aiFeaturesService.scoreLeadAi(id, req.user.tenantId, req.user.id);
  }

  @Post('insights/customer/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate AI customer insights' })
  async customerInsights(@Param('id') id: string, @Request() req: any) {
    return this.aiFeaturesService.generateCustomerInsights(id, req.user.tenantId, req.user.id);
  }

  @Post('insights/deal/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate AI deal summary and recommendations' })
  async dealInsights(@Param('id') id: string, @Request() req: any) {
    return this.aiFeaturesService.generateDealSummary(id, req.user.tenantId, req.user.id);
  }

  @Post('insights/appointment/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate AI appointment agenda and preparation' })
  async appointmentAgenda(@Param('id') id: string, @Request() req: any) {
    return this.aiFeaturesService.generateAppointmentAgenda(id, req.user.tenantId, req.user.id);
  }

  @Post('generate/email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'AI-generated emails for various scenarios' })
  async generateEmail(
    @Body() body: { type: string; entityType?: string; entityId?: string; tone?: string; language?: string },
    @Request() req: any,
  ) {
    return this.aiFeaturesService.generateEmail({ ...body, tenantId: req.user.tenantId, userId: req.user.id });
  }

  @Post('generate/whatsapp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'AI-generated WhatsApp messages' })
  async generateWhatsApp(
    @Body() body: { type: string; entityType?: string; entityId?: string; format?: string; language?: string },
    @Request() req: any,
  ) {
    return this.aiFeaturesService.generateWhatsApp({ ...body, tenantId: req.user.tenantId, userId: req.user.id });
  }

  @Post('summarize/call')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Summarize a call transcript and extract action items' })
  async summarizeCall(
    @Body() body: { transcript: string; entityType?: string; entityId?: string },
    @Request() req: any,
  ) {
    return this.aiFeaturesService.summarizeCall({ ...body, tenantId: req.user.tenantId, userId: req.user.id });
  }
}
