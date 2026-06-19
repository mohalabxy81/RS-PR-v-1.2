import { Version, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditLogsService } from './audit-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../roles/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PERMISSIONS } from '../roles/permissions.constants';
import { CurrentUser } from "../common/decorators/current-user.decorator";
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('audit-logs')
@Controller({ path: 'audit-logs', version: '1' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @RequirePermissions('read:audit-logs')
  @Get()
  @ApiOperation({ summary: 'List audit logs with pagination and filters' })
  @RequirePermissions(PERMISSIONS.VIEW_AUDIT_LOGS)
  async findAll(@CurrentUser() user: CurrentUserPayload, @Query() query: any) {
    return this.auditLogsService.findAll(user.tenantId, query);
  }
}
