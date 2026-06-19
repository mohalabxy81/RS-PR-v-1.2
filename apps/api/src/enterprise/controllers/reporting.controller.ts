import { CreateReportDto, UpdateReportDto } from '../dto/enterprise.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Version, Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ReportingService } from '../services/reporting.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('Enterprise / Reporting')
@Controller('enterprise/reporting')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  // --- Reports ---

  @RequirePermissions('enterprise.manage')
  @Get(':organizationId/reports')
  async getReports(
    @CurrentUser() user: CurrentUserPayload,
    @Param('organizationId') organizationId: string
  ) {
    return this.reportingService.getReports(user.tenantId, organizationId);
  }

  @RequirePermissions('enterprise.manage')
  @Post(':organizationId/reports')
  async createReport(
    @CurrentUser() user: CurrentUserPayload,
    @Param('organizationId') organizationId: string,
    @Body() data: CreateReportDto
  ) {
    return this.reportingService.createReport(user.tenantId, organizationId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Put('reports/:reportId')
  async updateReport(
    @CurrentUser() user: CurrentUserPayload,
    @Param('reportId') reportId: string,
    @Body() data: UpdateReportDto
  ) {
    return this.reportingService.updateReport(user.tenantId, reportId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Delete('reports/:reportId')
  async deleteReport(
    @CurrentUser() user: CurrentUserPayload,
    @Param('reportId') reportId: string
  ) {
    return this.reportingService.deleteReport(user.tenantId, reportId);
  }

  // --- Data Exports ---

  @RequirePermissions('enterprise.manage')
  @Get(':organizationId/data-exports')
  async getDataExports(
    @CurrentUser() user: CurrentUserPayload,
    @Param('organizationId') organizationId: string
  ) {
    return this.reportingService.getDataExports(user.tenantId, organizationId);
  }

  @RequirePermissions('enterprise.manage')
  @Post(':organizationId/data-exports')
  async requestDataExport(
    @CurrentUser() user: CurrentUserPayload,
    @Param('organizationId') organizationId: string,
    @Body() data: any
  ) {
    return this.reportingService.requestDataExport(user.tenantId, organizationId, data);
  }

  // --- Audit Exports ---

  @RequirePermissions('enterprise.manage')
  @Get(':organizationId/audit-exports')
  async getAuditExports(
    @CurrentUser() user: CurrentUserPayload,
    @Param('organizationId') organizationId: string
  ) {
    return this.reportingService.getAuditExports(user.tenantId, organizationId);
  }

  @RequirePermissions('enterprise.manage')
  @Post(':organizationId/audit-exports')
  async requestAuditExport(
    @CurrentUser() user: CurrentUserPayload,
    @Param('organizationId') organizationId: string,
    @Body() data: any
  ) {
    return this.reportingService.requestAuditExport(user.tenantId, organizationId, data);
  }
}
