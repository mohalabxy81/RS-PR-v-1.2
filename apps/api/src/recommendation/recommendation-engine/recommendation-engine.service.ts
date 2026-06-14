import { Injectable, Logger } from '@nestjs/common';
import { RecommendationSearchService } from '../recommendation-search/recommendation-search.service';

@Injectable()
export class RecommendationEngineService {
  private readonly logger = new Logger(RecommendationEngineService.name);

  constructor(
    private readonly searchService: RecommendationSearchService,
  ) {}

  /**
   * Main entry point to get property recommendations for a specific customer.
   * Steps:
   * 1. Retrieve the customer's embedding profile.
   * 2. Semantic search against property vectors using the customer's embedding.
   * 3. (Future) Rank the results via the Ranking Engine.
   */
  async getRecommendationsForCustomer(tenantId: string, customerId: string, embedding: number[]) {
    this.logger.log(`Generating recommendations for customer ${customerId}`);

    // Step 1: Semantic Search
    // We assume the customer's vector has been calculated and passed in (or retrieved from DB).
    const vectorMatches = await this.searchService.searchSimilarProperties(
      tenantId,
      embedding,
      20,
    );

    // Step 2: Scoring & Ranking (Simulated for MVP)
    // We map the vector results to a normalized score. Lower distance = higher match.
    const recommendations = vectorMatches.map((match) => {
      // Basic normalization: 1.0 - (distance / max_expected_distance)
      // L2 distance can be > 1, so this is just an approximation for sorting.
      const matchScore = Math.max(0, 1 - (match.distance / 2));
      
      return {
        propertyId: match.property_id,
        score: matchScore,
        confidence: matchScore > 0.8 ? 'HIGH' : 'MEDIUM',
        reasons: ['Based on semantic similarity to preferences.'],
      };
    });

    // Sort descending by score
    return recommendations.sort((a, b) => b.score - a.score);
  }
}
