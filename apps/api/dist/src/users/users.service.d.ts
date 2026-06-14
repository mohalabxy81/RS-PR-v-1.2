import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, data: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
        email: string;
        firstName: string;
        lastName: string;
    }>;
    findAll(tenantId: string): Promise<{
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
    findOne(tenantId: string, id: string): Promise<{
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
    update(tenantId: string, id: string, data: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
        email: string;
        firstName: string;
        lastName: string;
    }>;
    remove(tenantId: string, id: string): Promise<{
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
