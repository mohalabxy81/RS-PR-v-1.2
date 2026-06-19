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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
}
