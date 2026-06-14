import { UsersService } from './users.service';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(user: CurrentUserPayload, data: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
        email: string;
        firstName: string;
        lastName: string;
    }>;
    findAll(user: CurrentUserPayload): Promise<{
        branch: {
            name: string;
        } | null;
        role: {
            name: string;
        } | null;
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
        email: string;
        firstName: string;
        lastName: string;
    }[]>;
    findOne(user: CurrentUserPayload, id: string): Promise<{
        branch: {
            id: string;
            name: string;
        } | null;
        role: {
            id: string;
            name: string;
        } | null;
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
        email: string;
        firstName: string;
        lastName: string;
    }>;
    update(user: CurrentUserPayload, id: string, data: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
        email: string;
        firstName: string;
        lastName: string;
    }>;
    remove(user: CurrentUserPayload, id: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        tenantId: string;
        roleId: string | null;
        branchId: string | null;
        passwordHash: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        emailVerifiedAt: Date | null;
        lastLoginAt: Date | null;
    }>;
}
