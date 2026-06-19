import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ReportingService } from '../services/reporting.service';

@Controller('enterprise/reporting')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  // --- Reports ---

  @Get(':organizationId/reports')
  async getReports(@Param('organizationId') organizationId: string) {
    return this.reportingService.getReports(organizationId);
  }

  @Post(':organizationId/reports')
  async createReport(
    @Param('organizationId') organizationId: string,
    @Body() data: any
  ) {
    return this.reportingService.createReport(organizationId, data);
  }

  @Put('reports/:reportId')
  async updateReport(
    @Param('reportId') reportId: string,
    @Body() data: any
  ) {
    return this.reportingService.updateReport(reportId, data);
  }

  @Delete('reports/:reportId')
  async deleteReport(@Param('reportId') reportId: string) {
    return this.reportingService.deleteReport(reportId);
  }

  // --- Data Exports ---

  @Get(':organizationId/data-exports')
  async getDataExports(@Param('organizationId') organizationId: string) {
    return this.reportingService.getDataExports(organizationId);
  }

  @Post(':organizationId/data-exports')
  async requestDataExport(
    @Param('organizationId') organizationId: string,
    @Body() data: any
  ) {
    return this.reportingService.requestDataExport(organizationId, data);
  }

  // --- Audit Exports ---

  @Get(':organizationId/audit-exports')
  async getAuditExports(@Param('organizationId') organizationId: string) {
    return this.reportingService.getAuditExports(organizationId);
  }

  @Post(':organizationId/audit-exports')
  async requestAuditExport(
    @Param('organizationId') organizationId: string,
    @Body() data: any
  ) {
    return this.reportingService.requestAuditExport(organizationId, data);
  }
}
