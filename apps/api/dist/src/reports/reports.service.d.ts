import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getLeadReport(tenantId: string, query: any): Promise<{
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
    getDealReport(tenantId: string, query: any): Promise<{
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
    getPropertyReport(tenantId: string, query: any): Promise<{
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
    getAgentReport(tenantId: string, query: any): Promise<{
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
    getAppointmentReport(tenantId: string, query: any): Promise<{
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
    exportLeadsCsv(tenantId: string, query: any): Promise<string>;
    exportDealsCsv(tenantId: string, query: any): Promise<string>;
    private buildDateFilter;
    private escapeCsv;
}
