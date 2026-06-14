import { PrismaService } from '../prisma/prisma.service';
import { ActivitiesService } from '../activities/activities.service';
import { CreateDealDto, UpdateDealDto } from './dto/deal.dto';
import { DealStage } from '@prisma/client';
export declare class DealsService {
    private readonly prisma;
    private readonly activities;
    constructor(prisma: PrismaService, activities: ActivitiesService);
    create(tenantId: string, userId: string, dto: CreateDealDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        currency: string;
        propertyId: string | null;
        leadId: string | null;
        notes: string | null;
        assigneeId: string | null;
        customerId: string | null;
        value: number;
        stage: import("@prisma/client").$Enums.DealStage;
        forecastCloseDate: Date | null;
    }>;
    findAll(tenantId: string, query: any): Promise<({
        property: {
            id: string;
            title: string;
        } | null;
        lead: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
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
        leadId: string | null;
        notes: string | null;
        assigneeId: string | null;
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
        lead: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        customer: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        appointments: {
            id: string;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            title: string;
            type: import("@prisma/client").$Enums.AppointmentType;
            startTime: Date;
        }[];
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
            dealId: string;
            authorId: string;
        })[];
        assignee: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        stageHistory: {
            id: string;
            dealId: string;
            changedAt: Date;
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
        leadId: string | null;
        notes: string | null;
        assigneeId: string | null;
        customerId: string | null;
        value: number;
        stage: import("@prisma/client").$Enums.DealStage;
        forecastCloseDate: Date | null;
    }>;
    update(tenantId: string, id: string, dto: UpdateDealDto, userId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        currency: string;
        propertyId: string | null;
        leadId: string | null;
        notes: string | null;
        assigneeId: string | null;
        customerId: string | null;
        value: number;
        stage: import("@prisma/client").$Enums.DealStage;
        forecastCloseDate: Date | null;
    }>;
    updateStage(tenantId: string, id: string, userId: string, stage: DealStage): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        currency: string;
        propertyId: string | null;
        leadId: string | null;
        notes: string | null;
        assigneeId: string | null;
        customerId: string | null;
        value: number;
        stage: import("@prisma/client").$Enums.DealStage;
        forecastCloseDate: Date | null;
    }>;
    addNote(tenantId: string, dealId: string, authorId: string, content: string): Promise<{
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
        dealId: string;
        authorId: string;
    }>;
}
