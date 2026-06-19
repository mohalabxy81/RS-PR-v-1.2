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
exports.TenantsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tenants_service_1 = require("./tenants.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../roles/guards/permissions.guard");
const require_permissions_decorator_1 = require("../common/decorators/require-permissions.decorator");
const permissions_constants_1 = require("../roles/permissions.constants");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const tenant_dto_1 = require("./dto/tenant.dto");
let TenantsController = class TenantsController {
    tenantsService;
    constructor(tenantsService) {
        this.tenantsService = tenantsService;
    }
    async getMyTenant(user) {
        return this.tenantsService.findOne(user.tenantId);
    }
    async updateMyTenant(user, data) {
        const safeData = {
            name: data.name,
            logoUrl: data.logoUrl,
        };
        return this.tenantsService.update(user.tenantId, safeData);
    }
    async getAllTenants() {
        return this.tenantsService.findAll();
    }
    async getTenantById(id) {
        return this.tenantsService.findOne(id);
    }
};
exports.TenantsController = TenantsController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current tenant details' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "getMyTenant", null);
__decorate([
    (0, common_1.Put)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Update current tenant settings' }),
    (0, swagger_1.ApiBody)({ type: tenant_dto_1.UpdateTenantSettingsDto }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.MANAGE_SETTINGS),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, tenant_dto_1.UpdateTenantSettingsDto]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "updateMyTenant", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: '(Super Admin) List all tenants' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "getAllTenants", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '(Super Admin) Get tenant by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "getTenantById", null);
exports.TenantsController = TenantsController = __decorate([
    (0, swagger_1.ApiTags)('tenants'),
    (0, common_1.Controller)({ path: 'tenants', version: '1' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __metadata("design:paramtypes", [tenants_service_1.TenantsService])
], TenantsController);
//# sourceMappingURL=tenants.controller.js.map