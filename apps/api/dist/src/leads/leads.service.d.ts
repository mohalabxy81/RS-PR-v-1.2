import { PrismaService } from '../prisma/prisma.service';
export declare class LeadsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, createdById: string, data: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.LeadStatus;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        tenantId: string;
        branchId: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        propertyType: import("@prisma/client").$Enums.PropertyType | null;
        source: import("@prisma/client").$Enums.LeadSource;
        budget: number | null;
        budgetCurrency: string | null;
        preferredLocation: string | null;
        notes: string | null;
        isArchived: boolean;
        assigneeId: string | null;
        createdById: string | null;
    }>;
    findAll(tenantId: string, query: any): Promise<{
        data: ({
            assignee: {
                id: string;
                firstName: string;
                lastName: string;
            } | null;
            leadTags: {
                tag: string;
            }[];
        } & {
            id: string;
            status: import("@prisma/client").$Enums.LeadStatus;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            tenantId: string;
            branchId: string | null;
            firstName: string;
            lastName: string;
            phone: string | null;
            propertyType: import("@prisma/client").$Enums.PropertyType | null;
            source: import("@prisma/client").$Enums.LeadSource;
            budget: number | null;
            budgetCurrency: string | null;
            preferredLocation: string | null;
            notes: string | null;
            isArchived: boolean;
            assigneeId: string | null;
            createdById: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    findOne(tenantId: string, id: string): Promise<{
        leadNotes: ({
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
            leadId: string;
            authorId: string;
        })[];
        assignee: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        createdBy: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        leadTags: {
            tag: string;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.LeadStatus;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        tenantId: string;
        branchId: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        propertyType: import("@prisma/client").$Enums.PropertyType | null;
        source: import("@prisma/client").$Enums.LeadSource;
        budget: number | null;
        budgetCurrency: string | null;
        preferredLocation: string | null;
        notes: string | null;
        isArchived: boolean;
        assigneeId: string | null;
        createdById: string | null;
    }>;
    update(tenantId: string, id: string, data: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.LeadStatus;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        tenantId: string;
        branchId: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        propertyType: import("@prisma/client").$Enums.PropertyType | null;
        source: import("@prisma/client").$Enums.LeadSource;
        budget: number | null;
        budgetCurrency: string | null;
        preferredLocation: string | null;
        notes: string | null;
        isArchived: boolean;
        assigneeId: string | null;
        createdById: string | null;
    }>;
    addNote(tenantId: string, leadId: string, authorId: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        leadId: string;
        authorId: string;
    }>;
    assign(tenantId: string, id: string, assigneeId: string | null): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.LeadStatus;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        tenantId: string;
        branchId: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        propertyType: import("@prisma/client").$Enums.PropertyType | null;
        source: import("@prisma/client").$Enums.LeadSource;
        budget: number | null;
        budgetCurrency: string | null;
        preferredLocation: string | null;
        notes: string | null;
        isArchived: boolean;
        assigneeId: string | null;
        createdById: string | null;
    }>;
}
