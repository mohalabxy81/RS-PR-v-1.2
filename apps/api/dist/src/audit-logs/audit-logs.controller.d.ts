import { AuditLogsService } from './audit-logs.service';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class AuditLogsController {
    private readonly auditLogsService;
    constructor(auditLogsService: AuditLogsService);
    findAll(user: CurrentUserPayload, query: any): Promise<{
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
            userId: string | null;
            tenantId: string;
            action: string;
            ipAddress: string | null;
            userAgent: string | null;
            entity: string;
            entityId: string;
            before: import("@prisma/client/runtime/client").JsonValue | null;
            after: import("@prisma/client/runtime/client").JsonValue | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
}
