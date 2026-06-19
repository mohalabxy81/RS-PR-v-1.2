import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiPromptsService } from '../ai-prompts/ai-prompts.service';
import { CreateAiProviderDto, CreateAiModelDto, CreateAiPromptDto } from './dto/ai-admin.dto';

@Injectable()
export class AiAdminService {
  constructor(private readonly prisma: PrismaService, private readonly aiPrompts: AiPromptsService) {}

  async listProviders(tenantId: string) {
    return this.prisma.aiProvider.findMany({
      where: { OR: [{ tenantId }, { tenantId: null }] },
      include: { models: true },
    });
  }

  async createProvider(tenantId: string, data: CreateAiProviderDto) {
    return this.prisma.aiProvider.create({
      data: { ...data, tenantId },
    });
  }

  async listModels(tenantId: string) {
    // Return models for providers accessible by this tenant
    const providers = await this.listProviders(tenantId);
    const providerIds = providers.map(p => p.id);
    return this.prisma.aiModel.findMany({
      where: { providerId: { in: providerIds } },
      include: { provider: true },
    });
  }

  async createModel(tenantId: string, data: CreateAiModelDto) {
    return this.prisma.aiModel.create({
      data,
    });
  }

  async listPrompts(tenantId: string) {
    return this.prisma.aiPrompt.findMany({
      where: { OR: [{ tenantId }, { tenantId: null }] },
      include: {
        versions: {
          orderBy: { version: 'desc' },
        },
      },
      orderBy: { category: 'asc' },
    });
  }

  async createPrompt(data: CreateAiPromptDto & { tenantId: string }) {
    return this.aiPrompts.createPrompt(data);
  }

  async createPromptVersion(promptId: string, content: string, userId: string) {
    return this.aiPrompts.createPromptVersion(promptId, content, userId);
  }

  async activatePromptVersion(promptId: string, versionId: string) {
    return this.aiPrompts.activatePromptVersion(promptId, versionId);
  }
}
