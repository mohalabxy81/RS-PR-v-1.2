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
        tenantId: string;
        phone: string | null;
        branchId: string | null;
        email: string | null;
        firstName: string;
        lastName: string;
        propertyType: import("@prisma/client").$Enums.PropertyType | null;
        assigneeId: string | null;
        createdById: string | null;
        source: import("@prisma/client").$Enums.LeadSource;
        budget: number | null;
        budgetCurrency: string | null;
        preferredLocation: string | null;
        notes: string | null;
        isArchived: boolean;
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
            tenantId: string;
            phone: string | null;
            branchId: string | null;
            email: string | null;
            firstName: string;
            lastName: string;
            propertyType: import("@prisma/client").$Enums.PropertyType | null;
            assigneeId: string | null;
            createdById: string | null;
            source: import("@prisma/client").$Enums.LeadSource;
            budget: number | null;
            budgetCurrency: string | null;
            preferredLocation: string | null;
            notes: string | null;
            isArchived: boolean;
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
            title: string;
            type: import("@prisma/client").$Enums.AppointmentType;
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
            leadId: string;
            authorId: string;
            content: string;
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
        tenantId: string;
        phone: string | null;
        branchId: string | null;
        email: string | null;
        firstName: string;
        lastName: string;
        propertyType: import("@prisma/client").$Enums.PropertyType | null;
        assigneeId: string | null;
        createdById: string | null;
        source: import("@prisma/client").$Enums.LeadSource;
        budget: number | null;
        budgetCurrency: string | null;
        preferredLocation: string | null;
        notes: string | null;
        isArchived: boolean;
    }>;
    update(user: CurrentUserPayload, id: string, dto: UpdateLeadDto): Promise<{
        status: import("@prisma/client").$Enums.LeadStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        phone: string | null;
        branchId: string | null;
        email: string | null;
        firstName: string;
        lastName: string;
        propertyType: import("@prisma/client").$Enums.PropertyType | null;
        assigneeId: string | null;
        createdById: string | null;
        source: import("@prisma/client").$Enums.LeadSource;
        budget: number | null;
        budgetCurrency: string | null;
        preferredLocation: string | null;
        notes: string | null;
        isArchived: boolean;
    }>;
    archive(user: CurrentUserPayload, id: string): Promise<{
        status: import("@prisma/client").$Enums.LeadStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        phone: string | null;
        branchId: string | null;
        email: string | null;
        firstName: string;
        lastName: string;
        propertyType: import("@prisma/client").$Enums.PropertyType | null;
        assigneeId: string | null;
        createdById: string | null;
        source: import("@prisma/client").$Enums.LeadSource;
        budget: number | null;
        budgetCurrency: string | null;
        preferredLocation: string | null;
        notes: string | null;
        isArchived: boolean;
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
        leadId: string;
        authorId: string;
        content: string;
    }>;
    assign(user: CurrentUserPayload, id: string, dto: AssignLeadDto): Promise<{
        status: import("@prisma/client").$Enums.LeadStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        phone: string | null;
        branchId: string | null;
        email: string | null;
        firstName: string;
        lastName: string;
        propertyType: import("@prisma/client").$Enums.PropertyType | null;
        assigneeId: string | null;
        createdById: string | null;
        source: import("@prisma/client").$Enums.LeadSource;
        budget: number | null;
        budgetCurrency: string | null;
        preferredLocation: string | null;
        notes: string | null;
        isArchived: boolean;
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
        tenantId: string;
        userId: string | null;
        action: string;
        leadId: string | null;
        entityType: string;
        entityId: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    })[]>;
}
