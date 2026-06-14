import type { Response } from 'express';
import { ReportsService } from './reports.service';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getLeadReport(user: CurrentUserPayload, query: any): Promise<{
        summary: {
            totalLeads: number;
            wonLeads: number;
            lostLeads: number;
            conversionRate: string;
        };
        byStatus: {
            status: import("@prisma/client").$Enums.LeadStatus;
            count: number;
        }[];
        bySource: {
            source: import("@prisma/client").$Enums.LeadSource;
            count: number;
        }[];
        topAgents: {
            agentId: string | null;
            count: number;
        }[];
    }>;
    getDealReport(user: CurrentUserPayload, query: any): Promise<{
        summary: {
            totalDeals: number;
            closedWon: number;
            closedLost: number;
            winRate: string;
            totalRevenue: number;
            forecastRevenue: number;
        };
        byStage: {
            stage: import("@prisma/client").$Enums.DealStage;
            count: number;
            totalValue: number;
        }[];
        topAgents: {
            agentId: string | null;
            dealCount: number;
            totalValue: number;
        }[];
    }>;
    getPropertyReport(user: CurrentUserPayload, query: any): Promise<{
        summary: {
            totalProperties: number;
            avgPrice: number;
        };
        byType: {
            type: import("@prisma/client").$Enums.PropertyType;
            count: number;
        }[];
        byStatus: {
            status: import("@prisma/client").$Enums.PropertyStatus;
            count: number;
        }[];
        byListingType: {
            listingType: import("@prisma/client").$Enums.ListingType;
            count: number;
            avgPrice: number;
        }[];
    }>;
    getAgentReport(user: CurrentUserPayload, query: any): Promise<{
        agents: {
            agent: {
                id: string;
                name: string;
                email: string;
            };
            leads: number;
            dealsWon: number;
            dealsTotal: number;
            winRate: string;
            revenue: number;
            appointments: number;
            tasksCompleted: number;
        }[];
    }>;
    getAppointmentReport(user: CurrentUserPayload, query: any): Promise<{
        summary: {
            total: number;
        };
        byType: {
            type: import("@prisma/client").$Enums.AppointmentType;
            count: number;
        }[];
        byStatus: {
            status: import("@prisma/client").$Enums.AppointmentStatus;
            count: number;
        }[];
    }>;
    exportLeadsCsv(user: CurrentUserPayload, query: any, res: Response): Promise<void>;
    exportDealsCsv(user: CurrentUserPayload, query: any, res: Response): Promise<void>;
}
