"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reports_service_1 = require("./reports.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../roles/guards/permissions.guard");
const require_permissions_decorator_1 = require("../common/decorators/require-permissions.decorator");
const permissions_constants_1 = require("../roles/permissions.constants");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getLeadReport(user, query) {
        return this.reportsService.getLeadReport(user.tenantId, query);
    }
    async getDealReport(user, query) {
        return this.reportsService.getDealReport(user.tenantId, query);
    }
    async getPropertyReport(user, query) {
        return this.reportsService.getPropertyReport(user.tenantId, query);
    }
    async getAgentReport(user, query) {
        return this.reportsService.getAgentReport(user.tenantId, query);
    }
    async getAppointmentReport(user, query) {
        return this.reportsService.getAppointmentReport(user.tenantId, query);
    }
    async exportLeadsCsv(user, query, res) {
        const csv = await this.reportsService.exportLeadsCsv(user.tenantId, query);
        const filename = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csv);
    }
    async exportDealsCsv(user, query, res) {
        const csv = await this.reportsService.exportDealsCsv(user.tenantId, query);
        const filename = `deals-export-${new Date().toISOString().slice(0, 10)}.csv`;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csv);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('leads'),
    (0, swagger_1.ApiOperation)({ summary: 'Lead conversion and funnel report' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'branchId', required: false }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.VIEW_REPORTS),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getLeadReport", null);
__decorate([
    (0, common_1.Get)('deals'),
    (0, swagger_1.ApiOperation)({ summary: 'Deal pipeline and revenue report' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.VIEW_REPORTS),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getDealReport", null);
__decorate([
    (0, common_1.Get)('properties'),
    (0, swagger_1.ApiOperation)({ summary: 'Property inventory and status report' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.VIEW_REPORTS),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getPropertyReport", null);
__decorate([
    (0, common_1.Get)('agents'),
    (0, swagger_1.ApiOperation)({ summary: 'Agent performance report' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'branchId', required: false }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.VIEW_REPORTS),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAgentReport", null);
__decorate([
    (0, common_1.Get)('appointments'),
    (0, swagger_1.ApiOperation)({ summary: 'Appointment activity report' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.VIEW_REPORTS),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAppointmentReport", null);
__decorate([
    (0, common_1.Get)('export/leads'),
    (0, swagger_1.ApiOperation)({ summary: 'Export leads as CSV' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.EXPORT_REPORTS),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportLeadsCsv", null);
__decorate([
    (0, common_1.Get)('export/deals'),
    (0, swagger_1.ApiOperation)({ summary: 'Export deals as CSV' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.EXPORT_REPORTS),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "exportDealsCsv", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('reports'),
    (0, common_1.Controller)({ path: 'reports', version: '1' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map