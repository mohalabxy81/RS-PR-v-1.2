import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiCoreService, ChatMessage } from '../ai-core/ai-core.service';
import { AiKnowledgeService } from '../ai-knowledge/ai-knowledge.service';
import { AiMemoryService } from '../ai-memory/ai-memory.service';
import { AiPromptsService } from '../ai-prompts/ai-prompts.service';

export interface ChatRequestDto {
  conversationId?: string;
  message: string;
  contextType?: string; // 'Lead' | 'Property' | 'Deal' | 'Customer' | 'Appointment' | 'Task'
  contextId?: string;
  tenantId: string;
  userId: string;
}

export interface ChatResponseDto {
  conversationId: string;
  messageId: string;
  content: string;
  contextType?: string;
  contextId?: string;
  usage: { promptTokens: number; completionTokens: number; totalTokens: number };
}

@Injectable()
export class AiChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiCore: AiCoreService,
    private readonly aiKnowledge: AiKnowledgeService,
    private readonly aiMemory: AiMemoryService,
    private readonly aiPrompts: AiPromptsService,
  ) {}

  async chat(dto: ChatRequestDto): Promise<ChatResponseDto> {
    // 1. Resolve or create conversation
    let conversation: any;
    if (dto.conversationId) {
      conversation = await this.aiMemory.getConversation(dto.conversationId, dto.tenantId);
      if (conversation.userId !== dto.userId) {
        throw new ForbiddenException('Access denied to this conversation');
      }
    } else {
      // Auto-title from context
      const title = dto.contextType && dto.contextId
        ? `${dto.contextType} Chat`
        : 'New Conversation';
      conversation = await this.aiMemory.createConversation(
        dto.tenantId,
        dto.userId,
        dto.contextType,
        dto.contextId,
        title,
      );
    }

    // 2. Build system prompt — try to get from prompt library, fall back to default
    let systemPromptContent = await this.buildSystemPrompt(dto.tenantId, dto.contextType, dto.contextId);

    // 3. Retrieve RAG context
    const ragChunks = await this.retrieveRagContext(dto.tenantId, dto.message, dto.contextType, dto.contextId);
    if (ragChunks.length > 0) {
      const ragContext = ragChunks.map((c: any) => c.content).join('\n\n---\n\n');
      systemPromptContent += `\n\n## Relevant Knowledge Base Excerpts\n${ragContext}`;
    }

    // 4. Build message history (last 20 messages for context window management)
    const history = conversation.messages || [];
    const historyMessages: ChatMessage[] = history.slice(-20).map((m: any) => ({
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.content,
    }));

    // 5. Assemble final messages array
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPromptContent },
      ...historyMessages,
      { role: 'user', content: dto.message },
    ];

    // 6. Call AI
    const result = await this.aiCore.chatCompletion(messages, { tenantId: dto.tenantId });

    // 7. Persist messages
    await this.aiMemory.addMessage(conversation.id, 'user', dto.message, undefined);
    const assistantMessage = await this.aiMemory.addMessage(
      conversation.id,
      'assistant',
      result.content,
      result.usage.totalTokens,
    );

    // 8. Track usage
    await this.prisma.aiUsage.create({
      data: {
        tenantId: dto.tenantId,
        userId: dto.userId,
        feature: 'Chat',
        inputTokens: result.usage.promptTokens,
        outputTokens: result.usage.completionTokens,
        totalTokens: result.usage.totalTokens,
      },
    });

    // 9. Update conversation title if it's a new one and we now have message context
    if (!dto.conversationId && dto.message.length > 10) {
      const shortTitle = dto.message.substring(0, 60) + (dto.message.length > 60 ? '...' : '');
      await this.prisma.aiConversation.update({
        where: { id: conversation.id },
        data: { title: shortTitle },
      });
    }

    return {
      conversationId: conversation.id,
      messageId: assistantMessage.id,
      content: result.content,
      contextType: conversation.contextType,
      contextId: conversation.contextId,
      usage: result.usage,
    };
  }

  async listConversations(tenantId: string, userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.aiConversation.findMany({
        where: { tenantId, userId },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          contextType: true,
          contextId: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { messages: true } },
        },
      }),
      this.prisma.aiConversation.count({ where: { tenantId, userId } }),
    ]);
    return { items, total, page, limit };
  }

  async getConversation(conversationId: string, tenantId: string, userId: string) {
    const conversation = await this.aiMemory.getConversation(conversationId, tenantId);
    if (conversation.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return conversation;
  }

  async deleteConversation(conversationId: string, tenantId: string, userId: string) {
    const conversation = await this.prisma.aiConversation.findUnique({ where: { id: conversationId } });
    if (!conversation || conversation.tenantId !== tenantId || conversation.userId !== userId) {
      throw new NotFoundException('Conversation not found');
    }
    await this.prisma.aiConversation.delete({ where: { id: conversationId } });
    return { success: true };
  }

  private async buildSystemPrompt(tenantId: string, contextType?: string, contextId?: string): Promise<string> {
    let base = `You are an AI Copilot for a Real Estate CRM platform called REIS. You assist real estate agents, managers, and support staff.
You have access to company data, property listings, leads, deals, customers, and appointments.
Always be professional, concise, and data-driven. If you reference specific data, cite it clearly.
Current date/time: ${new Date().toISOString()}.`;

    if (contextType && contextId) {
      const contextData = await this.fetchContextData(contextType, contextId, tenantId);
      if (contextData) {
        base += `\n\n## Current Context\nYou are viewing a ${contextType}. Here are the details:\n${JSON.stringify(contextData, null, 2)}`;
      }
    }

    // Try to get tenant-specific system prompt
    try {
      const customPrompt = await this.aiPrompts.getActivePromptContent('ai_copilot_system', tenantId);
      base = customPrompt + '\n\n' + base;
    } catch {
      // No custom prompt — use default
    }

    return base;
  }

  private async fetchContextData(contextType: string, contextId: string, tenantId: string): Promise<any> {
    try {
      switch (contextType.toLowerCase()) {
        case 'lead':
          return this.prisma.lead.findFirst({
            where: { id: contextId, tenantId },
            include: { assignee: { select: { firstName: true, lastName: true } }, leadNotes: { take: 3, orderBy: { createdAt: 'desc' } } },
          });
        case 'property':
          return this.prisma.property.findFirst({
            where: { id: contextId, tenantId },
            include: { agent: { select: { firstName: true, lastName: true } } },
          });
        case 'deal':
          return this.prisma.deal.findFirst({
            where: { id: contextId, tenantId },
            include: {
              customer: { select: { firstName: true, lastName: true, email: true } },
              property: { select: { title: true, price: true, city: true } },
              assignee: { select: { firstName: true, lastName: true } },
            },
          });
        case 'customer':
          return this.prisma.customer.findFirst({
            where: { id: contextId, tenantId },
            include: { customerNotes: { take: 3, orderBy: { createdAt: 'desc' } } },
          });
        case 'appointment':
          return this.prisma.appointment.findFirst({
            where: { id: contextId, tenantId },
            include: {
              lead: { select: { firstName: true, lastName: true } },
              property: { select: { title: true, address: true } },
            },
          });
        default:
          return null;
      }
    } catch {
      return null;
    }
  }

  private async retrieveRagContext(tenantId: string, query: string, contextType?: string, contextId?: string): Promise<any[]> {
    try {
      return await this.aiKnowledge.searchKnowledge(tenantId, query, 3);
    } catch {
      return [];
    }
  }
}
