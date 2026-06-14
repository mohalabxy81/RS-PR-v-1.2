import { NotificationsService } from './notifications.service';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(user: CurrentUserPayload, query: any): Promise<{
        id: string;
        createdAt: Date;
        link: string | null;
        userId: string;
        tenantId: string;
        title: string;
        type: import("@prisma/client").$Enums.NotificationType;
        message: string;
        isRead: boolean;
        readAt: Date | null;
    }[]>;
    markAsRead(user: CurrentUserPayload, id: string): Promise<{
        id: string;
        createdAt: Date;
        link: string | null;
        userId: string;
        tenantId: string;
        title: string;
        type: import("@prisma/client").$Enums.NotificationType;
        message: string;
        isRead: boolean;
        readAt: Date | null;
    }>;
    markAllAsRead(user: CurrentUserPayload): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
