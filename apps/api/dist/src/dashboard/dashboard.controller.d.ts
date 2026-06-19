import { DashboardService } from './dashboard.service';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getMetrics(user: CurrentUserPayload): Promise<{
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
    getRecentActivities(user: CurrentUserPayload): Promise<({
        user: {
            firstName: string;
            lastName: string;
        } | null;
    } & {
        description: string | null;
        id: string;
        createdAt: Date;
        userId: string | null;
        tenantId: string;
        action: string;
        entityId: string;
        entityType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        leadId: string | null;
    })[]>;
}
