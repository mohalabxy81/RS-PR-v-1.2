import { LeadsService } from './leads.service';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { CreateLeadDto, UpdateLeadDto, AssignLeadDto, AddLeadNoteDto, QueryLeadDto } from './dto/lead.dto';
export declare class LeadsController {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    create(user: CurrentUserPayload, dto: CreateLeadDto): Promise<{
        status: import("@prisma/client").$Enums.LeadStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        tenantId: string;
        firstName: string;
        lastName: string;
        branchId: string | null;
        phone: string | null;
        propertyType: import("@prisma/client").$Enums.PropertyType | null;
        source: import("@prisma/client").$Enums.LeadSource;
        budget: number | null;
        budgetCurrency: string | null;
        preferredLocation: string | null;
        notes: string | null;
        assigneeId: string | null;
        isArchived: boolean;
        createdById: string | null;
    }>;
    findAll(user: CurrentUserPayload, query: QueryLeadDto): Promise<{
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
            status: import("@prisma/client").$Enums.LeadStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            tenantId: string;
            firstName: string;
            lastName: string;
            branchId: string | null;
            phone: string | null;
            propertyType: import("@prisma/client").$Enums.PropertyType | null;
            source: import("@prisma/client").$Enums.LeadSource;
            budget: number | null;
            budgetCurrency: string | null;
            preferredLocation: string | null;
            notes: string | null;
            assigneeId: string | null;
            isArchived: boolean;
            createdById: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(user: CurrentUserPayload, id: string): Promise<{
        deals: {
            id: string;
            title: string;
            value: number;
            stage: import("@prisma/client").$Enums.DealStage;
        }[];
        appointments: {
            status: import("@prisma/client").$Enums.AppointmentStatus;
            id: string;
            type: import("@prisma/client").$Enums.AppointmentType;
            title: string;
            startTime: Date;
        }[];
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
        status: import("@prisma/client").$Enums.LeadStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        tenantId: string;
        firstName: string;
        lastName: string;
        branchId: string | null;
        phone: string | null;
        propertyType: import("@prisma/client").$Enums.PropertyType | null;
        source: import("@prisma/client").$Enums.LeadSource;
        budget: number | null;
        budgetCurrency: string | null;
        preferredLocation: string | null;
        notes: string | null;
        assigneeId: string | null;
        isArchived: boolean;
        createdById: string | null;
    }>;
    update(user: CurrentUserPayload, id: string, dto: UpdateLeadDto): Promise<{
        status: import("@prisma/client").$Enums.LeadStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        tenantId: string;
        firstName: string;
        lastName: string;
        branchId: string | null;
        phone: string | null;
        propertyType: import("@prisma/client").$Enums.PropertyType | null;
        source: import("@prisma/client").$Enums.LeadSource;
        budget: number | null;
        budgetCurrency: string | null;
        preferredLocation: string | null;
        notes: string | null;
        assigneeId: string | null;
        isArchived: boolean;
        createdById: string | null;
    }>;
    archive(user: CurrentUserPayload, id: string): Promise<{
        status: import("@prisma/client").$Enums.LeadStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        tenantId: string;
        firstName: string;
        lastName: string;
        branchId: string | null;
        phone: string | null;
        propertyType: import("@prisma/client").$Enums.PropertyType | null;
        source: import("@prisma/client").$Enums.LeadSource;
        budget: number | null;
        budgetCurrency: string | null;
        preferredLocation: string | null;
        notes: string | null;
        assigneeId: string | null;
        isArchived: boolean;
        createdById: string | null;
    }>;
    addNote(user: CurrentUserPayload, id: string, dto: AddLeadNoteDto): Promise<{
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
    }>;
    assign(user: CurrentUserPayload, id: string, dto: AssignLeadDto): Promise<{
        status: import("@prisma/client").$Enums.LeadStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        tenantId: string;
        firstName: string;
        lastName: string;
        branchId: string | null;
        phone: string | null;
        propertyType: import("@prisma/client").$Enums.PropertyType | null;
        source: import("@prisma/client").$Enums.LeadSource;
        budget: number | null;
        budgetCurrency: string | null;
        preferredLocation: string | null;
        notes: string | null;
        assigneeId: string | null;
        isArchived: boolean;
        createdById: string | null;
    }>;
    getTimeline(user: CurrentUserPayload, id: string): Promise<({
        user: {
            id: string;
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
