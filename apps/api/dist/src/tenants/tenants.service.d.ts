import { PrismaService } from '../prisma/prisma.service';
export declare class TenantsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        slug: string;
        domain: string | null;
        logoUrl: string | null;
        status: import("@prisma/client").$Enums.TenantStatus;
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
        id: string;
        name: string;
        slug: string;
        domain: string | null;
        logoUrl: string | null;
        status: import("@prisma/client").$Enums.TenantStatus;
        subscriptionPlan: import("@prisma/client").$Enums.SubscriptionPlan;
        subscriptionStatus: string;
        trialEndsAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        name: string;
        slug: string;
        domain: string | null;
        logoUrl: string | null;
        status: import("@prisma/client").$Enums.TenantStatus;
        subscriptionPlan: import("@prisma/client").$Enums.SubscriptionPlan;
        subscriptionStatus: string;
        trialEndsAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStatus(id: string, status: any): Promise<{
        id: string;
        name: string;
        slug: string;
        domain: string | null;
        logoUrl: string | null;
        status: import("@prisma/client").$Enums.TenantStatus;
        subscriptionPlan: import("@prisma/client").$Enums.SubscriptionPlan;
        subscriptionStatus: string;
        trialEndsAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
