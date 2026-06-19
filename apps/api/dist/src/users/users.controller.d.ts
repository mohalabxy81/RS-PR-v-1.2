import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(user: CurrentUserPayload, data: CreateUserDto): Promise<{
        status: import("@prisma/client").$Enums.UserStatus;
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }>;
    findAll(user: CurrentUserPayload): Promise<{
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
    findOne(user: CurrentUserPayload, id: string): Promise<{
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
    update(user: CurrentUserPayload, id: string, data: UpdateUserDto): Promise<{
        status: import("@prisma/client").$Enums.UserStatus;
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }>;
    remove(user: CurrentUserPayload, id: string): Promise<{
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
