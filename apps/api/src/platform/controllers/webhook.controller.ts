import { Version, Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { WebhookService } from '../services/webhook.service';
import { RegisterWebhookDto, UpdateWebhookDto } from '../dto/webhook.dto';

@ApiTags('platform-webhooks')
@ApiBearerAuth('access-token')
@Controller({ path: 'platform/webhooks', version: '1' })
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @RequirePermissions('platform.manage')
  @Post('projects/:projectId')
  @ApiOperation({ summary: 'Register a new webhook endpoint for a project' })
  @ApiResponse({ status: 201, description: 'Webhook registered. Secret returned for signature verification.' })
  @ApiBody({ type: RegisterWebhookDto })
  async registerWebhook(
    @Param('projectId') projectId: string,
    @Body() body: RegisterWebhookDto
  ) {
    return this.webhookService.registerWebhook(projectId, body);
  }

  @RequirePermissions('platform.manage')
  @Get('projects/:projectId')
  @ApiOperation({ summary: 'List all webhook endpoints for a project' })
  @ApiResponse({ status: 200, description: 'List of webhook endpoints' })
  async getWebhooks(@Param('projectId') projectId: string) {
    return this.webhookService.getWebhooks(projectId);
  }

  @RequirePermissions('platform.manage')
  @Put(':webhookId')
  @ApiOperation({ summary: 'Update a webhook endpoint configuration' })
  @ApiResponse({ status: 200, description: 'Webhook updated' })
  @ApiBody({ type: UpdateWebhookDto })
  async updateWebhook(
    @Param('webhookId') webhookId: string,
    @Body() data: UpdateWebhookDto
  ) {
    return this.webhookService.updateWebhook(webhookId, data);
  }

  @RequirePermissions('platform.manage')
  @Delete(':webhookId')
  @ApiOperation({ summary: 'Delete a webhook endpoint' })
  @ApiResponse({ status: 200, description: 'Webhook deleted' })
  async deleteWebhook(@Param('webhookId') webhookId: string) {
    return this.webhookService.deleteWebhook(webhookId);
  }

  @RequirePermissions('platform.manage')
  @Get(':webhookId/deliveries')
  @ApiOperation({ summary: 'Get recent delivery logs for a webhook endpoint' })
  @ApiResponse({ status: 200, description: 'Delivery log list (max 100 recent)' })
  async getDeliveries(@Param('webhookId') webhookId: string) {
    return this.webhookService.getDeliveries(webhookId);
  }

  // --- Events (Internal / Admin mostly) ---

  @RequirePermissions('platform.manage')
  @Get('events/logs')
  @ApiOperation({ summary: 'Get recent platform event logs (admin only)' })
  @ApiResponse({ status: 200, description: 'List of event logs' })
  async getEventLogs() {
    return this.webhookService.getEventLogs();
  }
}
