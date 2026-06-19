import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string, userId: string, query: any): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        link: string | null;
        tenantId: string;
        userId: string;
        title: string;
        type: import("@prisma/client").$Enums.NotificationType;
        isRead: boolean;
        readAt: Date | null;
    }[]>;
    markAsRead(tenantId: string, userId: string, id: string): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        link: string | null;
        tenantId: string;
        userId: string;
        title: string;
        type: import("@prisma/client").$Enums.NotificationType;
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
        message: string;
        id: string;
        createdAt: Date;
        link: string | null;
        tenantId: string;
        userId: string;
        title: string;
        type: import("@prisma/client").$Enums.NotificationType;
        isRead: boolean;
        readAt: Date | null;
    }>;
}
