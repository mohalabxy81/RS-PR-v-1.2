import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, userId: string, query: any) {
    const { unreadOnly = false, limit = 50 } = query;

    const where: any = { tenantId, userId };
    if (unreadOnly === 'true') where.isRead = false;

    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
    });
  }

  async markAsRead(tenantId: string, userId: string, id: string) {
    const notif = await this.prisma.notification.findFirst({ where: { id, tenantId, userId } });
    if (!notif) throw new NotFoundException('Notification not found');

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(tenantId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { tenantId, userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  // Internal method
  async createNotification(data: {
    tenantId: string;
    userId: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'REMINDER';
    title: string;
    message: string;
    link?: string;
  }) {
    return this.prisma.notification.create({ data });
  }
}
