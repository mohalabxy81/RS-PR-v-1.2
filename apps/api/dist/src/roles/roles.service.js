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
var RolesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const permissions_constants_1 = require("./permissions.constants");
let RolesService = RolesService_1 = class RolesService {
    prisma;
    logger = new common_1.Logger(RolesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        await this.seedPermissions();
    }
    async seedPermissions() {
        const permissionValues = Object.values(permissions_constants_1.PERMISSIONS);
        for (const action of permissionValues) {
            await this.prisma.permission.upsert({
                where: { action },
                update: {},
                create: { action, description: `Permission: ${action}` },
            });
        }
        this.logger.log(`Seeded ${permissionValues.length} permissions`);
    }
    async seedTenantRolePermissions(tenantId) {
        const roles = await this.prisma.role.findMany({
            where: { tenantId, isSystem: true },
        });
        const allPermissions = await this.prisma.permission.findMany();
        const permissionMap = new Map(allPermissions.map((p) => [p.action, p.id]));
        for (const role of roles) {
            const rolePerms = permissions_constants_1.ROLE_PERMISSIONS[role.name] || [];
            for (const action of rolePerms) {
                const permId = permissionMap.get(action);
                if (!permId)
                    continue;
                await this.prisma.rolePermission.upsert({
                    where: {
                        roleId_permissionId: { roleId: role.id, permissionId: permId },
                    },
                    update: {},
                    create: { roleId: role.id, permissionId: permId },
                });
            }
        }
        this.logger.log(`Seeded role permissions for tenant: ${tenantId}`);
    }
    async getAllPermissions() {
        return this.prisma.permission.findMany({ orderBy: { action: 'asc' } });
    }
    async getRolesForTenant(tenantId) {
        return this.prisma.role.findMany({
            where: { tenantId },
            include: {
                rolePermissions: { include: { permission: true } },
                _count: { select: { users: true } },
            },
        });
    }
    async getRoleById(id, tenantId) {
        return this.prisma.role.findFirst({
            where: { id, tenantId },
            include: { rolePermissions: { include: { permission: true } } },
        });
    }
    async createRole(tenantId, name, permissionIds) {
        return this.prisma.$transaction(async (tx) => {
            const role = await tx.role.create({
                data: { tenantId, name, isSystem: false },
            });
            if (permissionIds.length) {
                await tx.rolePermission.createMany({
                    data: permissionIds.map((permissionId) => ({
                        roleId: role.id,
                        permissionId,
                    })),
                    skipDuplicates: true,
                });
            }
            return tx.role.findUnique({
                where: { id: role.id },
                include: { rolePermissions: { include: { permission: true } } },
            });
        });
    }
    async updateRolePermissions(roleId, tenantId, permissionIds) {
        const role = await this.prisma.role.findFirst({ where: { id: roleId, tenantId } });
        if (!role)
            return null;
        return this.prisma.$transaction(async (tx) => {
            await tx.rolePermission.deleteMany({ where: { roleId } });
            if (permissionIds.length) {
                await tx.rolePermission.createMany({
                    data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
                    skipDuplicates: true,
                });
            }
            return tx.role.findUnique({
                where: { id: roleId },
                include: { rolePermissions: { include: { permission: true } } },
            });
        });
    }
    async deleteRole(roleId, tenantId) {
        const role = await this.prisma.role.findFirst({ where: { id: roleId, tenantId } });
        if (!role || role.isSystem)
            return null;
        return this.prisma.role.delete({ where: { id: roleId } });
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = RolesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RolesService);
//# sourceMappingURL=roles.service.js.map