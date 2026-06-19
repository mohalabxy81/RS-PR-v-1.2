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
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_service_1 = require("./roles.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("./guards/permissions.guard");
const require_permissions_decorator_1 = require("../common/decorators/require-permissions.decorator");
const permissions_constants_1 = require("./permissions.constants");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let RolesController = class RolesController {
    rolesService;
    constructor(rolesService) {
        this.rolesService = rolesService;
    }
    async getAllPermissions() {
        return this.rolesService.getAllPermissions();
    }
    async getRoles(user) {
        return this.rolesService.getRolesForTenant(user.tenantId);
    }
    async getRoleById(user, id) {
        const role = await this.rolesService.getRoleById(id, user.tenantId);
        if (!role)
            throw new common_1.NotFoundException('Role not found');
        return role;
    }
    async createRole(user, name, permissionIds) {
        if (!name || !permissionIds || !Array.isArray(permissionIds)) {
            throw new common_1.BadRequestException('Invalid payload');
        }
        return this.rolesService.createRole(user.tenantId, name, permissionIds);
    }
    async updateRolePermissions(user, id, permissionIds) {
        if (!permissionIds || !Array.isArray(permissionIds)) {
            throw new common_1.BadRequestException('Invalid payload');
        }
        const updated = await this.rolesService.updateRolePermissions(id, user.tenantId, permissionIds);
        if (!updated)
            throw new common_1.NotFoundException('Role not found');
        return updated;
    }
    async deleteRole(user, id) {
        const deleted = await this.rolesService.deleteRole(id, user.tenantId);
        if (!deleted)
            throw new common_1.NotFoundException('Role not found or is a system role');
        return { message: 'Role deleted successfully' };
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, require_permissions_decorator_1.RequirePermissions)('read:roles'),
    (0, common_1.Get)('permissions'),
    (0, swagger_1.ApiOperation)({ summary: 'List all available permissions' }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.READ_ROLE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "getAllPermissions", null);
__decorate([
    (0, require_permissions_decorator_1.RequirePermissions)('read:roles'),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all roles for the current tenant' }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.READ_ROLE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "getRoles", null);
__decorate([
    (0, require_permissions_decorator_1.RequirePermissions)('read:roles'),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific role by ID' }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.READ_ROLE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "getRoleById", null);
__decorate([
    (0, require_permissions_decorator_1.RequirePermissions)('create:roles'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new custom role' }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.CREATE_ROLE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)('name')),
    __param(2, (0, common_1.Body)('permissionIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Array]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "createRole", null);
__decorate([
    (0, require_permissions_decorator_1.RequirePermissions)('update:roles'),
    (0, common_1.Put)(':id/permissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Update permissions for a custom role' }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.UPDATE_ROLE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('permissionIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Array]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "updateRolePermissions", null);
__decorate([
    (0, require_permissions_decorator_1.RequirePermissions)('delete:roles'),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a custom role' }),
    (0, require_permissions_decorator_1.RequirePermissions)(permissions_constants_1.PERMISSIONS.DELETE_ROLE),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "deleteRole", null);
exports.RolesController = RolesController = __decorate([
    (0, swagger_1.ApiTags)('roles'),
    (0, common_1.Controller)({ path: 'roles', version: '1' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    __metadata("design:paramtypes", [roles_service_1.RolesService])
], RolesController);
//# sourceMappingURL=roles.controller.js.map