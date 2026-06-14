import { ActivitiesService } from './activities.service';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class ActivitiesController {
    private readonly activitiesService;
    constructor(activitiesService: ActivitiesService);
    findAll(user: CurrentUserPayload, query: any): Promise<{
        data: ({
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
            entityType: string;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            leadId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
}
