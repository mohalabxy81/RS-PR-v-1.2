import { PrismaService } from '../prisma/prisma.service';
export declare class AuditLogsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string, query: any): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            tenantId: string;
            userId: string | null;
            ipAddress: string | null;
            userAgent: string | null;
            action: string;
            entityId: string;
            entity: string;
            before: import("@prisma/client/runtime/client").JsonValue | null;
            after: import("@prisma/client/runtime/client").JsonValue | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    createLog(data: {
        tenantId: string;
        userId?: string;
        action: string;
        entity: string;
        entityId: string;
        before?: any;
        after?: any;
    }): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        userId: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        action: string;
        entityId: string;
        entity: string;
        before: import("@prisma/client/runtime/client").JsonValue | null;
        after: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
}
