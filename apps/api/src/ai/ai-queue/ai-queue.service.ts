import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AiQueueService {
  constructor(private readonly prisma: PrismaService) {}

  // Placeholder for real BullMQ add
  async addDocumentProcessJob(tenantId: string, documentId: string) {
    console.log(`[Queue] Added job to process document ${documentId} for tenant ${tenantId}`);
    return true;
  }

  async addSummaryJob(tenantId: string, entityType: string, entityId: string) {
    console.log(`[Queue] Added job to summarize ${entityType} ${entityId} for tenant ${tenantId}`);
    return true;
  }
}
