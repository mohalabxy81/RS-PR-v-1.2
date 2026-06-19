import { Version, Controller, Get, Put, Param, Query, UseGuards, Post } from '@nestjs/common';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from "../common/decorators/current-user.decorator";
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('notifications')
@Controller({ path: 'notifications', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @RequirePermissions('read:notifications')
  @Get()
  @ApiOperation({ summary: 'List user notifications' })
  async findAll(@CurrentUser() user: CurrentUserPayload, @Query() query: any) {
    return this.notificationsService.findAll(user.tenantId, user.userId, query);
  }

  @RequirePermissions('update:notifications')
  @Put(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  async markAsRead(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.notificationsService.markAsRead(user.tenantId, user.userId, id);
  }

  @RequirePermissions('create:notifications')
  @Post('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@CurrentUser() user: CurrentUserPayload) {
    return this.notificationsService.markAllAsRead(user.tenantId, user.userId);
  }
}
