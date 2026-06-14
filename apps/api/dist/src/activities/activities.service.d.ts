import { PrismaService } from '../prisma/prisma.service';
export declare class ActivitiesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string, query: any): Promise<({
        user: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        tenantId: string;
        action: string;
        description: string | null;
        entityId: string;
        leadId: string | null;
        entityType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    })[]>;
    logActivity(data: {
        tenantId: string;
        userId?: string;
        entityType: string;
        entityId: string;
        action: string;
        description?: string;
        metadata?: any;
        leadId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        tenantId: string;
        action: string;
        description: string | null;
        entityId: string;
        leadId: string | null;
        entityType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
}
