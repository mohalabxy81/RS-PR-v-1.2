import { RolesService } from './roles.service';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    getAllPermissions(): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        action: string;
    }[]>;
    getRoles(user: CurrentUserPayload): Promise<({
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
    getRoleById(user: CurrentUserPayload, id: string): Promise<{
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
    }>;
    createRole(user: CurrentUserPayload, name: string, permissionIds: string[]): Promise<({
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
    updateRolePermissions(user: CurrentUserPayload, id: string, permissionIds: string[]): Promise<{
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
    }>;
    deleteRole(user: CurrentUserPayload, id: string): Promise<{
        message: string;
    }>;
}
