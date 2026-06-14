import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RecommendationSearchService {
  private readonly logger = new Logger(RecommendationSearchService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Search properties using pgvector's <-> operator (L2 distance).
   * @param tenantId The tenant context
   * @param queryEmbedding The 1536-dimensional vector to search against
   * @param limit Max results to return
   */
  async searchSimilarProperties(
    tenantId: string,
    queryEmbedding: number[],
    limit: number = 10,
  ) {
    if (!queryEmbedding || queryEmbedding.length !== 1536) {
      throw new Error('Invalid query embedding dimensions. Expected 1536.');
    }

    try {
      // Cast the embedding array to a vector string format that pgvector understands: '[0.1, 0.2, ...]'
      const vectorStr = `[${queryEmbedding.join(',')}]`;

      // Perform raw SQL query to use the pgvector similarity operator
      const results = await this.prisma.$queryRawUnsafe<
        Array<{
          id: string;
          property_id: string;
          distance: number;
        }>
      >(
        `
        SELECT
          id,
          "propertyId" as property_id,
          embedding <-> $1::vector as distance
        FROM "PropertyVector"
        WHERE "tenantId" = $2
        ORDER BY distance ASC
        LIMIT $3
        `,
        vectorStr,
        tenantId,
        limit,
      );

      return results;
    } catch (error) {
      this.logger.error('Failed to execute semantic search for properties', error.stack);
      throw error;
    }
  }

  /**
   * Find similar customers based on search intent vectors
   */
  async searchSimilarCustomers(
    tenantId: string,
    queryEmbedding: number[],
    limit: number = 10,
  ) {
    const vectorStr = `[${queryEmbedding.join(',')}]`;

    return this.prisma.$queryRawUnsafe<
      Array<{
        id: string;
        customer_id: string;
        distance: number;
      }>
    >(
      `
      SELECT
        id,
        "customerId" as customer_id,
        embedding <-> $1::vector as distance
      FROM "CustomerVector"
      WHERE "tenantId" = $2
      ORDER BY distance ASC
      LIMIT $3
      `,
      vectorStr,
      tenantId,
      limit,
    );
  }
}
