import { TenantsService } from './tenants.service';
import { UpdateTenantSettingsDto } from './dto/tenant.dto';
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
        status: import("@prisma/client").$Enums.TenantStatus;
        name: string;
        slug: string;
        logoUrl: string | null;
        id: string;
        domain: string | null;
        subscriptionPlan: import("@prisma/client").$Enums.SubscriptionPlan;
        subscriptionStatus: string;
        trialEndsAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMyTenant(user: CurrentUserPayload, data: UpdateTenantSettingsDto): Promise<{
        status: import("@prisma/client").$Enums.TenantStatus;
        name: string;
        slug: string;
        logoUrl: string | null;
        id: string;
        domain: string | null;
        subscriptionPlan: import("@prisma/client").$Enums.SubscriptionPlan;
        subscriptionStatus: string;
        trialEndsAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllTenants(): Promise<{
        status: import("@prisma/client").$Enums.TenantStatus;
        name: string;
        slug: string;
        logoUrl: string | null;
        id: string;
        domain: string | null;
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
        status: import("@prisma/client").$Enums.TenantStatus;
        name: string;
        slug: string;
        logoUrl: string | null;
        id: string;
        domain: string | null;
        subscriptionPlan: import("@prisma/client").$Enums.SubscriptionPlan;
        subscriptionStatus: string;
        trialEndsAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
