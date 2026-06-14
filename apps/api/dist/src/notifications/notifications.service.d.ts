import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string, userId: string, query: any): Promise<{
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
    markAsRead(tenantId: string, userId: string, id: string): Promise<{
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
    markAllAsRead(tenantId: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    createNotification(data: {
        tenantId: string;
        userId: string;
        type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'REMINDER';
        title: string;
        message: string;
        link?: string;
    }): Promise<{
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
}
