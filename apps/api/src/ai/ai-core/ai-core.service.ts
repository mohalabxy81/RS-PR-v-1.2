import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { AiProviderType } from '@prisma/client';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiCompletionOptions {
  tenantId?: string;
  modelIdentifier?: string; // Optional override for specific model
  temperature?: number;
  maxTokens?: number;
}

export interface AiCompletionResult {
  content: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

@Injectable()
export class AiCoreService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Determine which provider and model to use, initialized with API keys.
   */
  private async getProviderConfig(tenantId?: string, preferredModel?: string) {
    // Basic logic: Find default model. If tenant-specific provider doesn't exist, fallback to global.
    let modelQuery: any = { isActive: true };
    if (preferredModel) {
      modelQuery.modelIdentifier = preferredModel;
    } else {
      modelQuery.isDefault = true;
    }

    const model = await this.prisma.aiModel.findFirst({
      where: modelQuery,
      include: { provider: true },
    });

    if (!model) {
      throw new InternalServerErrorException('No active AI model configuration found.');
    }

    return { provider: model.provider, model };
  }

  async chatCompletion(messages: ChatMessage[], options?: AiCompletionOptions): Promise<AiCompletionResult> {
    const { provider, model } = await this.getProviderConfig(options?.tenantId, options?.modelIdentifier);

    if (!provider.apiKey) {
      throw new InternalServerErrorException(`API Key for provider ${provider.name} is missing.`);
    }

    const temperature = options?.temperature ?? 0.7;
    const maxTokens = options?.maxTokens ?? 1024;

    switch (provider.type) {
      case AiProviderType.OPENAI:
        return this.openAIChatCompletion(provider.apiKey, model.modelIdentifier, messages, temperature, maxTokens);
      case AiProviderType.ANTHROPIC:
        return this.anthropicChatCompletion(provider.apiKey, model.modelIdentifier, messages, temperature, maxTokens);
      case AiProviderType.LOCAL:
      case AiProviderType.OTHER:
        // For Local/OpenAI-compatible APIs like vLLM or Ollama
        if (!provider.baseUrl) {
          throw new InternalServerErrorException('Base URL is required for LOCAL/OTHER providers.');
        }
        return this.openAIChatCompletion(provider.apiKey, model.modelIdentifier, messages, temperature, maxTokens, provider.baseUrl);
      default:
        throw new InternalServerErrorException(`Unsupported provider type: ${provider.type}`);
    }
  }

  private async openAIChatCompletion(
    apiKey: string,
    modelId: string,
    messages: ChatMessage[],
    temperature: number,
    maxTokens: number,
    baseURL?: string,
  ): Promise<AiCompletionResult> {
    const openai = new OpenAI({ apiKey, baseURL });
    
    const response = await openai.chat.completions.create({
      model: modelId,
      messages: messages as any,
      temperature,
      max_tokens: maxTokens,
    });

    return {
      content: response.choices[0]?.message?.content || '',
      model: response.model,
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
    };
  }

  private async anthropicChatCompletion(
    apiKey: string,
    modelId: string,
    messages: ChatMessage[],
    temperature: number,
    maxTokens: number,
  ): Promise<AiCompletionResult> {
    const anthropic = new Anthropic({ apiKey });
    
    // Anthropic extracts 'system' message from the messages array
    const systemMessage = messages.find(m => m.role === 'system')?.content;
    const userAndAssistantMessages = messages.filter(m => m.role !== 'system') as any;

    const response = await anthropic.messages.create({
      model: modelId,
      messages: userAndAssistantMessages,
      system: systemMessage,
      temperature,
      max_tokens: maxTokens,
    });

    const content = response.content[0]?.type === 'text' ? response.content[0].text : '';

    return {
      content,
      model: response.model,
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
    };
  }

  async generateEmbeddings(input: string | string[], options?: { tenantId?: string }): Promise<number[][]> {
    // Assuming OpenAI for embeddings as a default
    const provider = await this.prisma.aiProvider.findFirst({
      where: { type: AiProviderType.OPENAI, isActive: true },
    });

    if (!provider || !provider.apiKey) {
      throw new InternalServerErrorException('No active OpenAI provider found for embeddings.');
    }

    const openai = new OpenAI({ apiKey: provider.apiKey });
    
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input,
    });

    return response.data.map(d => d.embedding);
  }
}
