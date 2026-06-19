import { PrismaService } from '../prisma/prisma.service';
import { UpdateTenantDto } from './dto/tenant.dto';
import { TenantStatus } from '@prisma/client';
export declare class TenantsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        status: import("@prisma/client").$Enums.TenantStatus;
        id: string;
        name: string;
        slug: string;
        domain: string | null;
        logoUrl: string | null;
        subscriptionPlan: import("@prisma/client").$Enums.SubscriptionPlan;
        subscriptionStatus: string;
        trialEndsAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        _count: {
            branches: number;
            users: number;
            properties: number;
            leads: number;
        };
    } & {
        status: import("@prisma/client").$Enums.TenantStatus;
        id: string;
        name: string;
        slug: string;
        domain: string | null;
        logoUrl: string | null;
        subscriptionPlan: import("@prisma/client").$Enums.SubscriptionPlan;
        subscriptionStatus: string;
        trialEndsAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: UpdateTenantDto): Promise<{
        status: import("@prisma/client").$Enums.TenantStatus;
        id: string;
        name: string;
        slug: string;
        domain: string | null;
        logoUrl: string | null;
        subscriptionPlan: import("@prisma/client").$Enums.SubscriptionPlan;
        subscriptionStatus: string;
        trialEndsAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStatus(id: string, status: TenantStatus): Promise<{
        status: import("@prisma/client").$Enums.TenantStatus;
        id: string;
        name: string;
        slug: string;
        domain: string | null;
        logoUrl: string | null;
        subscriptionPlan: import("@prisma/client").$Enums.SubscriptionPlan;
        subscriptionStatus: string;
        trialEndsAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
