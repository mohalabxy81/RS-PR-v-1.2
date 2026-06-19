import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMetrics(tenantId: string, userId: string, roleName?: string): Promise<{
        type: string;
        leads: number;
        appointments: number;
        tasks: number;
        properties: number;
        deals: number;
        totalLeads?: undefined;
        openDeals?: undefined;
        totalRevenue?: undefined;
        activeAgents?: undefined;
        activeProperties?: undefined;
    } | {
        type: string;
        totalLeads: number;
        openDeals: number;
        totalRevenue: number;
        activeAgents: number;
        activeProperties: number;
        leads?: undefined;
        appointments?: undefined;
        tasks?: undefined;
        properties?: undefined;
        deals?: undefined;
    }>;
    getRecentActivities(tenantId: string, limit?: number): Promise<({
        user: {
            firstName: string;
            lastName: string;
        } | null;
    } & {
        description: string | null;
        id: string;
        createdAt: Date;
        tenantId: string;
        userId: string | null;
        action: string;
        leadId: string | null;
        entityType: string;
        entityId: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    })[]>;
}
