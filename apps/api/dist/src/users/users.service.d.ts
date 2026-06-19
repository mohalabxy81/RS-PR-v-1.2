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
            name: string;
            id: string;
        } | null;
        role: {
            name: string;
            id: string;
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
        email: string;
        tenantId: string;
        roleId: string | null;
        firstName: string;
        lastName: string;
        branchId: string | null;
        passwordHash: string;
        phone: string | null;
        avatarUrl: string | null;
        emailVerifiedAt: Date | null;
        lastLoginAt: Date | null;
    }>;
}
