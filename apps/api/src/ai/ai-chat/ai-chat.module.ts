import { Module } from '@nestjs/common';
import { AiChatService } from './ai-chat.service';
import { AiChatController } from './ai-chat.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AiCoreModule } from '../ai-core/ai-core.module';
import { AiKnowledgeModule } from '../ai-knowledge/ai-knowledge.module';
import { AiMemoryModule } from '../ai-memory/ai-memory.module';
import { AiPromptsModule } from '../ai-prompts/ai-prompts.module';

@Module({
  imports: [PrismaModule, AiCoreModule, AiKnowledgeModule, AiMemoryModule, AiPromptsModule],
  providers: [AiChatService],
  controllers: [AiChatController],
  exports: [AiChatService],
})
export class AiChatModule {}
