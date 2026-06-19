import { Module } from '@nestjs/common';
import { AiCoreModule } from './ai-core/ai-core.module';
import { AiKnowledgeModule } from './ai-knowledge/ai-knowledge.module';
import { AiMemoryModule } from './ai-memory/ai-memory.module';
import { AiPromptsModule } from './ai-prompts/ai-prompts.module';
import { AiChatModule } from './ai-chat/ai-chat.module';
import { AiFeaturesModule } from './ai-features/ai-features.module';
import { AiAnalyticsModule } from './ai-analytics/ai-analytics.module';
import { AiFeedbackModule } from './ai-feedback/ai-feedback.module';
import { AiAdminModule } from './ai-admin/ai-admin.module';
import { AiQueueModule } from './ai-queue/ai-queue.module';

@Module({
  imports: [
    AiCoreModule,
    AiKnowledgeModule,
    AiMemoryModule,
    AiPromptsModule,
    AiChatModule,
    AiFeaturesModule,
    AiAnalyticsModule,
    AiFeedbackModule,
    AiAdminModule,
    AiQueueModule,
  ],
})
export class AiModule {}
