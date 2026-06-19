import { Version, Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AiAnalyticsService } from './ai-analytics.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('AI Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Version('1')
@Controller('ai/analytics')
export class AiAnalyticsController {
  constructor(private readonly aiAnalyticsService: AiAnalyticsService) {}

  @Get()
  @ApiOperation({ summary: 'Get AI usage analytics dashboard metrics' })
  async getDashboard(@Request() req: any, @Query('days') days = '30') {
    return this.aiAnalyticsService.getDashboardMetrics(req.user.tenantId, undefined, +days);
  }

  @Get('my-usage')
  @ApiOperation({ summary: 'Get current user AI usage stats' })
  async getMyUsage(@Request() req: any, @Query('days') days = '30') {
    return this.aiAnalyticsService.getDashboardMetrics(req.user.tenantId, req.user.id, +days);
  }

  @Get('by-user')
  @ApiOperation({ summary: 'Get AI usage breakdown per user (manager/admin only)' })
  async getByUser(@Request() req: any, @Query('days') days = '30') {
    return this.aiAnalyticsService.getUsageByUser(req.user.tenantId, +days);
  }
}
