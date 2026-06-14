import { PrismaService } from '../prisma/prisma.service';
export declare class DealsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        currency: string;
        propertyId: string | null;
        notes: string | null;
        assigneeId: string | null;
        leadId: string | null;
        customerId: string | null;
        value: number;
        stage: import("@prisma/client").$Enums.DealStage;
        forecastCloseDate: Date | null;
    }>;
    findAll(tenantId: string, query: any): Promise<({
        customer: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        assignee: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        currency: string;
        propertyId: string | null;
        notes: string | null;
        assigneeId: string | null;
        leadId: string | null;
        customerId: string | null;
        value: number;
        stage: import("@prisma/client").$Enums.DealStage;
        forecastCloseDate: Date | null;
    })[]>;
    findOne(tenantId: string, id: string): Promise<{
        property: {
            id: string;
            title: string;
        } | null;
        customer: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        dealNotes: ({
            author: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            authorId: string;
            dealId: string;
        })[];
        assignee: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        stageHistory: {
            id: string;
            changedAt: Date;
            dealId: string;
            fromStage: import("@prisma/client").$Enums.DealStage | null;
            toStage: import("@prisma/client").$Enums.DealStage;
            changedBy: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        currency: string;
        propertyId: string | null;
        notes: string | null;
        assigneeId: string | null;
        leadId: string | null;
        customerId: string | null;
        value: number;
        stage: import("@prisma/client").$Enums.DealStage;
        forecastCloseDate: Date | null;
    }>;
    updateStage(tenantId: string, id: string, userId: string, stage: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        currency: string;
        propertyId: string | null;
        notes: string | null;
        assigneeId: string | null;
        leadId: string | null;
        customerId: string | null;
        value: number;
        stage: import("@prisma/client").$Enums.DealStage;
        forecastCloseDate: Date | null;
    }>;
    update(tenantId: string, id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        currency: string;
        propertyId: string | null;
        notes: string | null;
        assigneeId: string | null;
        leadId: string | null;
        customerId: string | null;
        value: number;
        stage: import("@prisma/client").$Enums.DealStage;
        forecastCloseDate: Date | null;
    }>;
    addNote(tenantId: string, dealId: string, authorId: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: string;
        dealId: string;
    }>;
}
