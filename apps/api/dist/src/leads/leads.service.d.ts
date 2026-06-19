import { PrismaService } from '../prisma/prisma.service';
import { ActivitiesService } from '../activities/activities.service';
import { CreateLeadDto, UpdateLeadDto, QueryLeadDto } from './dto/lead.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class LeadsService {
    private readonly prisma;
    private readonly activities;
    private readonly eventEmitter;
    constructor(prisma: PrismaService, activities: ActivitiesService, eventEmitter: EventEmitter2);
    create(tenantId: string, createdById: string, dto: CreateLeadDto): Promise<{
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
    findAll(tenantId: string, query: QueryLeadDto): Promise<{
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
    findOne(tenantId: string, id: string): Promise<{
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
    update(tenantId: string, id: string, dto: UpdateLeadDto, updatedById?: string): Promise<{
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
    archive(tenantId: string, id: string): Promise<{
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
    addNote(tenantId: string, leadId: string, authorId: string, content: string): Promise<{
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
    assign(tenantId: string, id: string, assigneeId: string | null, assignedById?: string): Promise<{
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
    getTimeline(tenantId: string, leadId: string): Promise<({
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
