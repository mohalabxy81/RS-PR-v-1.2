import { Version, Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from "../common/decorators/current-user.decorator";
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('dashboard')
@Controller({ path: 'dashboard', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Get role-based dashboard metrics' })
  async getMetrics(@CurrentUser() user: CurrentUserPayload) {
    return this.dashboardService.getMetrics(user.tenantId, user.userId, user.roleName);
  }

  @Get('activities')
  @ApiOperation({ summary: 'Get recent activities for dashboard feed' })
  async getRecentActivities(@CurrentUser() user: CurrentUserPayload) {
    return this.dashboardService.getRecentActivities(user.tenantId, 10);
  }
}
