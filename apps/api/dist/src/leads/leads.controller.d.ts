import { LeadsService } from './leads.service';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class LeadsController {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    create(user: CurrentUserPayload, data: any): Promise<{
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
    findAll(user: CurrentUserPayload, query: any): Promise<{
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
    findOne(user: CurrentUserPayload, id: string): Promise<{
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
    update(user: CurrentUserPayload, id: string, data: any): Promise<{
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
    addNote(user: CurrentUserPayload, id: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        leadId: string;
        authorId: string;
    }>;
    assign(user: CurrentUserPayload, id: string, assigneeId: string): Promise<{
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
