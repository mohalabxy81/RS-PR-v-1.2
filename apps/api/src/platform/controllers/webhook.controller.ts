import { Version, Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../common/decorators/current-user.decorator';
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
    @CurrentUser() user: CurrentUserPayload,
    @Param('projectId') projectId: string,
    @Body() body: RegisterWebhookDto
  ) {
    return this.webhookService.registerWebhook(user.tenantId, projectId, body);
  }

  @RequirePermissions('platform.manage')
  @Get('projects/:projectId')
  @ApiOperation({ summary: 'List all webhook endpoints for a project' })
  @ApiResponse({ status: 200, description: 'List of webhook endpoints' })
  async getWebhooks(
    @CurrentUser() user: CurrentUserPayload,
    @Param('projectId') projectId: string
  ) {
    return this.webhookService.getWebhooks(user.tenantId, projectId);
  }

  @RequirePermissions('platform.manage')
  @Put(':webhookId')
  @ApiOperation({ summary: 'Update a webhook endpoint configuration' })
  @ApiResponse({ status: 200, description: 'Webhook updated' })
  @ApiBody({ type: UpdateWebhookDto })
  async updateWebhook(
    @CurrentUser() user: CurrentUserPayload,
    @Param('webhookId') webhookId: string,
    @Body() data: UpdateWebhookDto
  ) {
    return this.webhookService.updateWebhook(user.tenantId, webhookId, data);
  }

  @RequirePermissions('platform.manage')
  @Delete(':webhookId')
  @ApiOperation({ summary: 'Delete a webhook endpoint' })
  @ApiResponse({ status: 200, description: 'Webhook deleted' })
  async deleteWebhook(
    @CurrentUser() user: CurrentUserPayload,
    @Param('webhookId') webhookId: string
  ) {
    return this.webhookService.deleteWebhook(user.tenantId, webhookId);
  }

  @RequirePermissions('platform.manage')
  @Get(':webhookId/deliveries')
  @ApiOperation({ summary: 'Get recent delivery logs for a webhook endpoint' })
  @ApiResponse({ status: 200, description: 'Delivery log list (max 100 recent)' })
  async getDeliveries(
    @CurrentUser() user: CurrentUserPayload,
    @Param('webhookId') webhookId: string
  ) {
    return this.webhookService.getDeliveries(user.tenantId, webhookId);
  }

  @RequirePermissions('platform.manage')
  @Post(':webhookId/rotate-secret')
  @ApiOperation({ summary: 'Rotate a webhook endpoint secret' })
  @ApiResponse({ status: 200, description: 'Secret rotated' })
  async rotateSecret(
    @CurrentUser() user: CurrentUserPayload,
    @Param('webhookId') webhookId: string
  ) {
    return this.webhookService.rotateSecret(user.tenantId, webhookId);
  }

  // --- Events (Internal / Admin mostly) ---

  @RequirePermissions('platform.manage')
  @Get('events/logs')
  @ApiOperation({ summary: 'Get recent platform event logs (admin only)' })
  @ApiResponse({ status: 200, description: 'List of event logs' })
  async getEventLogs(@CurrentUser() user: CurrentUserPayload) {
    return this.webhookService.getEventLogs(user.tenantId);
  }
}
