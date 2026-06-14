import { Module } from '@nestjs/common';
import { AiQueueService } from './ai-queue.service';
import { AiQueueProcessor } from './ai-queue.processor';
import { PrismaModule } from '../../prisma/prisma.module';
import { AiCoreModule } from '../ai-core/ai-core.module';
import { AiKnowledgeModule } from '../ai-knowledge/ai-knowledge.module';

@Module({
  imports: [PrismaModule, AiCoreModule, AiKnowledgeModule],
  providers: [AiQueueService, AiQueueProcessor],
  exports: [AiQueueService],
})
export class AiQueueModule {}
