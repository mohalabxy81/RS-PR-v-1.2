import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiCoreService } from '../ai-core/ai-core.service';

@Injectable()
export class AiKnowledgeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiCore: AiCoreService,
  ) {}

  /**
   * Splits text into smaller chunks. Simple naive chunker for demonstration.
   */
  private chunkText(text: string, chunkSize = 1000): string[] {
    const chunks = [];
    let i = 0;
    while (i < text.length) {
      chunks.push(text.slice(i, i + chunkSize));
      i += chunkSize;
    }
    return chunks;
  }

  async ingestKnowledge(tenantId: string, type: string, sourceId: string, content: string, metadata?: any) {
    // 1. Create the knowledge source
    const knowledgeSource = await this.prisma.aiKnowledgeSource.create({
      data: {
        tenantId,
        type,
        sourceId,
        content,
        metadata,
      },
    });

    // 2. Chunk content
    const chunks = this.chunkText(content);

    // 3. Generate embeddings
    const embeddings = await this.aiCore.generateEmbeddings(chunks, { tenantId });

    // 4. Save embeddings (Prisma doesn't natively support creating vectors via Prisma Client create API yet without raw query)
    for (let i = 0; i < chunks.length; i++) {
      const embeddingVector = `[${embeddings[i].join(',')}]`;
      
      // We use raw query because of pgvector
      await this.prisma.$executeRaw`
        INSERT INTO "AiEmbedding" ("id", "knowledgeSourceId", "chunkIndex", "content", "embedding", "createdAt")
        VALUES (
          gen_random_uuid(), 
          ${knowledgeSource.id}, 
          ${i}, 
          ${chunks[i]}, 
          ${embeddingVector}::vector, 
          NOW()
        )
      `;
    }

    return knowledgeSource;
  }

  async searchKnowledge(tenantId: string, query: string, limit = 5): Promise<any[]> {
    // 1. Generate embedding for query
    const [queryEmbedding] = await this.aiCore.generateEmbeddings([query], { tenantId });
    const queryVector = `[${queryEmbedding.join(',')}]`;

    // 2. Search using pgvector cosine distance (<=>)
    const results = await this.prisma.$queryRaw`
      SELECT 
        e.id, 
        e.content, 
        e."knowledgeSourceId",
        1 - (e.embedding <=> ${queryVector}::vector) as similarity
      FROM "AiEmbedding" e
      JOIN "AiKnowledgeSource" ks ON e."knowledgeSourceId" = ks.id
      WHERE ks."tenantId" = ${tenantId}
      ORDER BY e.embedding <=> ${queryVector}::vector
      LIMIT ${limit};
    `;

    return results as any[];
  }
}
