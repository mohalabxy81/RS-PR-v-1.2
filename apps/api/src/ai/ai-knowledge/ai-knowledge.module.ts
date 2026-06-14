import { Module } from '@nestjs/common';
import { AiKnowledgeService } from './ai-knowledge.service';
import { AiCoreModule } from '../ai-core/ai-core.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [AiCoreModule, PrismaModule],
  providers: [AiKnowledgeService],
  exports: [AiKnowledgeService],
})
export class AiKnowledgeModule {}
