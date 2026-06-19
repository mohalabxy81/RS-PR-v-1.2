import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
interface TrackActivityParams {
    tenantId: string;
    userId?: string;
    entityType: string;
    entityId: string;
    action: string;
    description?: string;
    metadata?: Prisma.InputJsonValue;
    leadId?: string;
}
export declare class ActivitiesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    track(params: TrackActivityParams): Promise<void>;
    findAll(tenantId: string, query: any): Promise<{
        data: ({
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
            metadata: Prisma.JsonValue | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
}
export {};
