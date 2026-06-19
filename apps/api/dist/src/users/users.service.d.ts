import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, data: CreateUserDto): Promise<{
        status: import("@prisma/client").$Enums.UserStatus;
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }>;
    findAll(tenantId: string): Promise<{
        status: import("@prisma/client").$Enums.UserStatus;
        branch: {
            name: string;
        } | null;
        role: {
            name: string;
        } | null;
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }[]>;
    findOne(tenantId: string, id: string): Promise<{
        status: import("@prisma/client").$Enums.UserStatus;
        branch: {
            id: string;
            name: string;
        } | null;
        role: {
            id: string;
            name: string;
        } | null;
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }>;
    update(tenantId: string, id: string, data: UpdateUserDto): Promise<{
        status: import("@prisma/client").$Enums.UserStatus;
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }>;
    remove(tenantId: string, id: string): Promise<{
        status: import("@prisma/client").$Enums.UserStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        phone: string | null;
        branchId: string | null;
        roleId: string | null;
        email: string;
        passwordHash: string;
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
        emailVerifiedAt: Date | null;
        lastLoginAt: Date | null;
        failedLoginAttempts: number;
        lockedUntil: Date | null;
        isMfaEnabled: boolean;
        mfaSecret: string | null;
    }>;
}
