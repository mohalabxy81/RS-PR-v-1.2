import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PERMISSIONS, ROLE_PERMISSIONS } from './permissions.constants';

@Injectable()
export class RolesService implements OnModuleInit {
  private readonly logger = new Logger(RolesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Seeds all permissions into the database on startup.
   * Idempotent — safe to run multiple times.
   */
  async onModuleInit() {
    await this.seedPermissions();
  }

  async seedPermissions() {
    const permissionValues = Object.values(PERMISSIONS);

    for (const action of permissionValues) {
      await this.prisma.permission.upsert({
        where: { action },
        update: {},
        create: { action, description: `Permission: ${action}` },
      });
    }

    this.logger.log(`Seeded ${permissionValues.length} permissions`);
  }

  /**
   * Seeds default role permissions for a newly created tenant.
   * Called after tenant registration.
   */
  async seedTenantRolePermissions(tenantId: string) {
    const roles = await this.prisma.role.findMany({
      where: { tenantId, isSystem: true },
    });

    const allPermissions = await this.prisma.permission.findMany();
    const permissionMap = new Map(allPermissions.map((p) => [p.action, p.id]));

    for (const role of roles) {
      const rolePerms = ROLE_PERMISSIONS[role.name] || [];

      for (const action of rolePerms) {
        const permId = permissionMap.get(action);
        if (!permId) continue;

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

  async getRolesForTenant(tenantId: string) {
    return this.prisma.role.findMany({
      where: { tenantId },
      include: {
        rolePermissions: { include: { permission: true } },
        _count: { select: { users: true } },
      },
    });
  }

  async getRoleById(id: string, tenantId: string) {
    return this.prisma.role.findFirst({
      where: { id, tenantId },
      include: { rolePermissions: { include: { permission: true } } },
    });
  }

  async createRole(tenantId: string, name: string, permissionIds: string[]) {
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

  async updateRolePermissions(roleId: string, tenantId: string, permissionIds: string[]) {
    const role = await this.prisma.role.findFirst({ where: { id: roleId, tenantId } });
    if (!role) return null;

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

  async deleteRole(roleId: string, tenantId: string) {
    const role = await this.prisma.role.findFirst({ where: { id: roleId, tenantId } });
    if (!role || role.isSystem) return null; // Cannot delete system roles

    return this.prisma.role.delete({ where: { id: roleId } });
  }
}
