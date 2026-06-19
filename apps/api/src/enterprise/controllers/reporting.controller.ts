import { CreateReportDto, UpdateReportDto } from '../dto/enterprise.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Version, Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ReportingService } from '../services/reporting.service';

@ApiTags('Enterprise / Reporting')
@Controller('enterprise/reporting')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  // --- Reports ---

  @RequirePermissions('enterprise.manage')
  @Get(':organizationId/reports')
  async getReports(@Param('organizationId') organizationId: string) {
    return this.reportingService.getReports(organizationId);
  }

  @RequirePermissions('enterprise.manage')
  @Post(':organizationId/reports')
  async createReport(
    @Param('organizationId') organizationId: string,
    @Body() data: CreateReportDto
  ) {
    return this.reportingService.createReport(organizationId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Put('reports/:reportId')
  async updateReport(
    @Param('reportId') reportId: string,
    @Body() data: UpdateReportDto
  ) {
    return this.reportingService.updateReport(reportId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Delete('reports/:reportId')
  async deleteReport(@Param('reportId') reportId: string) {
    return this.reportingService.deleteReport(reportId);
  }

  // --- Data Exports ---

  @RequirePermissions('enterprise.manage')
  @Get(':organizationId/data-exports')
  async getDataExports(@Param('organizationId') organizationId: string) {
    return this.reportingService.getDataExports(organizationId);
  }

  @RequirePermissions('enterprise.manage')
  @Post(':organizationId/data-exports')
  async requestDataExport(
    @Param('organizationId') organizationId: string,
    @Body() data: any
  ) {
    return this.reportingService.requestDataExport(organizationId, data);
  }

  // --- Audit Exports ---

  @RequirePermissions('enterprise.manage')
  @Get(':organizationId/audit-exports')
  async getAuditExports(@Param('organizationId') organizationId: string) {
    return this.reportingService.getAuditExports(organizationId);
  }

  @RequirePermissions('enterprise.manage')
  @Post(':organizationId/audit-exports')
  async requestAuditExport(
    @Param('organizationId') organizationId: string,
    @Body() data: any
  ) {
    return this.reportingService.requestAuditExport(organizationId, data);
  }
}
