import { DealsService } from './deals.service';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { CreateDealDto, UpdateDealDto, UpdateDealStageDto, AddDealNoteDto, QueryDealDto } from './dto/deal.dto';
export declare class DealsController {
    private readonly dealsService;
    constructor(dealsService: DealsService);
    create(user: CurrentUserPayload, dto: CreateDealDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        currency: string;
        propertyId: string | null;
        assigneeId: string | null;
        notes: string | null;
        leadId: string | null;
        customerId: string | null;
        value: number;
        stage: import("@prisma/client").$Enums.DealStage;
        forecastCloseDate: Date | null;
    }>;
    findAll(user: CurrentUserPayload, query: QueryDealDto): Promise<({
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
        assigneeId: string | null;
        notes: string | null;
        leadId: string | null;
        customerId: string | null;
        value: number;
        stage: import("@prisma/client").$Enums.DealStage;
        forecastCloseDate: Date | null;
    })[]>;
    findOne(user: CurrentUserPayload, id: string): Promise<{
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
            status: import("@prisma/client").$Enums.AppointmentStatus;
            id: string;
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
            authorId: string;
            content: string;
            dealId: string;
        })[];
        assignee: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        stageHistory: {
            id: string;
            dealId: string;
            fromStage: import("@prisma/client").$Enums.DealStage | null;
            toStage: import("@prisma/client").$Enums.DealStage;
            changedAt: Date;
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
        assigneeId: string | null;
        notes: string | null;
        leadId: string | null;
        customerId: string | null;
        value: number;
        stage: import("@prisma/client").$Enums.DealStage;
        forecastCloseDate: Date | null;
    }>;
    update(user: CurrentUserPayload, id: string, dto: UpdateDealDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        currency: string;
        propertyId: string | null;
        assigneeId: string | null;
        notes: string | null;
        leadId: string | null;
        customerId: string | null;
        value: number;
        stage: import("@prisma/client").$Enums.DealStage;
        forecastCloseDate: Date | null;
    }>;
    updateStage(user: CurrentUserPayload, id: string, dto: UpdateDealStageDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        currency: string;
        propertyId: string | null;
        assigneeId: string | null;
        notes: string | null;
        leadId: string | null;
        customerId: string | null;
        value: number;
        stage: import("@prisma/client").$Enums.DealStage;
        forecastCloseDate: Date | null;
    }>;
    addNote(user: CurrentUserPayload, id: string, dto: AddDealNoteDto): Promise<{
        author: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        content: string;
        dealId: string;
    }>;
}
