import { Version, Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import type { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../roles/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PERMISSIONS } from '../roles/permissions.constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('reports')
@Version('1')
@Controller({ path: 'reports', version: '1' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('leads')
  @ApiOperation({ summary: 'Lead conversion and funnel report' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'branchId', required: false })
  @RequirePermissions(PERMISSIONS.VIEW_REPORTS)
  async getLeadReport(@CurrentUser() user: CurrentUserPayload, @Query() query: any) {
    return this.reportsService.getLeadReport(user.tenantId, query);
  }

  @Get('deals')
  @ApiOperation({ summary: 'Deal pipeline and revenue report' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @RequirePermissions(PERMISSIONS.VIEW_REPORTS)
  async getDealReport(@CurrentUser() user: CurrentUserPayload, @Query() query: any) {
    return this.reportsService.getDealReport(user.tenantId, query);
  }

  @Get('properties')
  @ApiOperation({ summary: 'Property inventory and status report' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @RequirePermissions(PERMISSIONS.VIEW_REPORTS)
  async getPropertyReport(@CurrentUser() user: CurrentUserPayload, @Query() query: any) {
    return this.reportsService.getPropertyReport(user.tenantId, query);
  }

  @Get('agents')
  @ApiOperation({ summary: 'Agent performance report' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'branchId', required: false })
  @RequirePermissions(PERMISSIONS.VIEW_REPORTS)
  async getAgentReport(@CurrentUser() user: CurrentUserPayload, @Query() query: any) {
    return this.reportsService.getAgentReport(user.tenantId, query);
  }

  @Get('appointments')
  @ApiOperation({ summary: 'Appointment activity report' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @RequirePermissions(PERMISSIONS.VIEW_REPORTS)
  async getAppointmentReport(@CurrentUser() user: CurrentUserPayload, @Query() query: any) {
    return this.reportsService.getAppointmentReport(user.tenantId, query);
  }

  @Get('export/leads')
  @ApiOperation({ summary: 'Export leads as CSV' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @RequirePermissions(PERMISSIONS.EXPORT_REPORTS)
  async exportLeadsCsv(
    @CurrentUser() user: CurrentUserPayload,
    @Query() query: any,
    @Res() res: Response,
  ) {
    const csv = await this.reportsService.exportLeadsCsv(user.tenantId, query);
    const filename = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }

  @Get('export/deals')
  @ApiOperation({ summary: 'Export deals as CSV' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @RequirePermissions(PERMISSIONS.EXPORT_REPORTS)
  async exportDealsCsv(
    @CurrentUser() user: CurrentUserPayload,
    @Query() query: any,
    @Res() res: Response,
  ) {
    const csv = await this.reportsService.exportDealsCsv(user.tenantId, query);
    const filename = `deals-export-${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }
}
