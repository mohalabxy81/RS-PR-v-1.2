import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class CommunicationConversationsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('outbound-messages') private outboundQueue: Queue,
  ) {}

  async list(tenantId: string, filters: {
    status?: string;
    assigneeId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { status, assigneeId, search, page = 1, limit = 25 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    if (status) where.status = status;
    if (assigneeId) where.assigneeId = assigneeId;
    if (search) {
      where.contact = { primaryName: { contains: search, mode: 'insensitive' } };
    }

    const [conversations, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where,
        include: {
          contact: { include: { channels: { take: 1 } } },
          assignee: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
          labels: true,
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { content: true, createdAt: true, direction: true, type: true },
          },
        },
        orderBy: { lastMessageAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.conversation.count({ where }),
    ]);

    return { conversations, total, page, limit };
  }

  async findOne(tenantId: string, id: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id, tenantId },
      include: {
        contact: { include: { channels: true } },
        assignee: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        labels: true,
      },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');
    return conversation;
  }

  async getMessages(tenantId: string, conversationId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, tenantId },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');

    // Reset unread count on read
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { unreadCount: 0 },
    });

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: { conversationId, tenantId },
        include: {
          attachments: true,
          sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.message.count({ where: { conversationId, tenantId } }),
    ]);

    return { messages, total, page, limit };
  }

  async assign(tenantId: string, conversationId: string, assigneeId: string | null) {
    await this.findOne(tenantId, conversationId);
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { assigneeId },
    });
  }

  async updateStatus(tenantId: string, conversationId: string, status: string) {
    await this.findOne(tenantId, conversationId);
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { status: status as any },
    });
  }

  async addLabel(tenantId: string, conversationId: string, name: string, color?: string) {
    await this.findOne(tenantId, conversationId);
    return this.prisma.conversationLabel.create({
      data: { conversationId, name, color },
    });
  }

  async removeLabel(tenantId: string, conversationId: string, labelId: string) {
    await this.findOne(tenantId, conversationId);
    return this.prisma.conversationLabel.deleteMany({
      where: { id: labelId, conversationId },
    });
  }

  async sendMessage(
    tenantId: string,
    conversationId: string,
    senderId: string,
    payload: { content: string; type?: string },
  ) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, tenantId },
      include: { contact: { include: { channels: { take: 1 } } } },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');

    // Find the provider account for this conversation
    const channel = conversation.contact.channels[0];

    // Create message record
    const message = await this.prisma.message.create({
      data: {
        tenantId,
        conversationId,
        providerAccountId: (conversation as any).providerAccountId ?? '',
        senderId,
        direction: 'OUTBOUND',
        type: (payload.type as any) ?? 'TEXT',
        content: payload.content,
        status: 'QUEUED',
      },
    });

    // Update conversation lastMessageAt
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    // Enqueue for actual delivery
    await this.outboundQueue.add('send-message', {
      messageId: message.id,
      tenantId,
      conversationId,
      to: channel?.identifier,
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });

    return message;
  }
}
