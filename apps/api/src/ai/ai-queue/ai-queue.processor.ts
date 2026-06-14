import { Injectable } from '@nestjs/common';
import { AiCoreService } from '../ai-core/ai-core.service';
import { AiKnowledgeService } from '../ai-knowledge/ai-knowledge.service';

@Injectable()
export class AiQueueProcessor {
  constructor(
    private readonly aiCore: AiCoreService,
    private readonly aiKnowledge: AiKnowledgeService,
  ) {}

  // Placeholder for BullMQ @Process
  async processDocument(job: any) {
    console.log(`Processing document job ${job.id}`);
  }
}
