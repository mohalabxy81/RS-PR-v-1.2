import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AiMemoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createConversation(tenantId: string, userId: string, contextType?: string, contextId?: string, title?: string) {
    return this.prisma.aiConversation.create({
      data: {
        tenantId,
        userId,
        contextType,
        contextId,
        title: title || 'New Conversation',
      },
    });
  }

  async getConversation(conversationId: string, tenantId: string) {
    const conversation = await this.prisma.aiConversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation || conversation.tenantId !== tenantId) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async addMessage(conversationId: string, role: string, content: string, tokens?: number) {
    return this.prisma.aiMessage.create({
      data: {
        conversationId,
        role,
        content,
        tokens,
      },
    });
  }
}
