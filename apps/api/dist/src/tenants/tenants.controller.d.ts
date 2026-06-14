import { TenantsService } from './tenants.service';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    getMyTenant(user: CurrentUserPayload): Promise<{
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
    updateMyTenant(user: CurrentUserPayload, data: any): Promise<{
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
    getAllTenants(): Promise<{
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
    getTenantById(id: string): Promise<{
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
}
