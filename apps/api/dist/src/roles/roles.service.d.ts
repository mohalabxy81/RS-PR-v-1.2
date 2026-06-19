import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
export declare class RolesService implements OnModuleInit {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    seedPermissions(): Promise<void>;
    seedTenantRolePermissions(tenantId: string): Promise<void>;
    getAllPermissions(): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        action: string;
    }[]>;
    getRolesForTenant(tenantId: string): Promise<({
        _count: {
            users: number;
        };
        rolePermissions: ({
            permission: {
                description: string | null;
                id: string;
                createdAt: Date;
                action: string;
            };
        } & {
            id: string;
            createdAt: Date;
            roleId: string;
            permissionId: string;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        isSystem: boolean;
    })[]>;
    getRoleById(id: string, tenantId: string): Promise<({
        rolePermissions: ({
            permission: {
                description: string | null;
                id: string;
                createdAt: Date;
                action: string;
            };
        } & {
            id: string;
            createdAt: Date;
            roleId: string;
            permissionId: string;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        isSystem: boolean;
    }) | null>;
    createRole(tenantId: string, name: string, permissionIds: string[]): Promise<({
        rolePermissions: ({
            permission: {
                description: string | null;
                id: string;
                createdAt: Date;
                action: string;
            };
        } & {
            id: string;
            createdAt: Date;
            roleId: string;
            permissionId: string;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        isSystem: boolean;
    }) | null>;
    updateRolePermissions(roleId: string, tenantId: string, permissionIds: string[]): Promise<({
        rolePermissions: ({
            permission: {
                description: string | null;
                id: string;
                createdAt: Date;
                action: string;
            };
        } & {
            id: string;
            createdAt: Date;
            roleId: string;
            permissionId: string;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        isSystem: boolean;
    }) | null>;
    deleteRole(roleId: string, tenantId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        isSystem: boolean;
    } | null>;
}
