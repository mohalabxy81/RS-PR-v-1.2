import { Module } from '@nestjs/common';
import { RecommendationCoreModule } from './recommendation-core/recommendation-core.module';
import { RecommendationEngineModule } from './recommendation-engine/recommendation-engine.module';
import { RecommendationRankingModule } from './recommendation-ranking/recommendation-ranking.module';
import { RecommendationSearchModule } from './recommendation-search/recommendation-search.module';
import { RecommendationSignalsModule } from './recommendation-signals/recommendation-signals.module';
import { RecommendationAiModule } from './recommendation-ai/recommendation-ai.module';
import { RecommendationAnalyticsModule } from './recommendation-analytics/recommendation-analytics.module';
import { RecommendationFeedbackModule } from './recommendation-feedback/recommendation-feedback.module';
import { RecommendationMonitoringModule } from './recommendation-monitoring/recommendation-monitoring.module';
import { RecommendationExperimentsModule } from './recommendation-experiments/recommendation-experiments.module';

@Module({
  imports: [
    RecommendationCoreModule,
    RecommendationEngineModule,
    RecommendationRankingModule,
    RecommendationSearchModule,
    RecommendationSignalsModule,
    RecommendationAiModule,
    RecommendationAnalyticsModule,
    RecommendationFeedbackModule,
    RecommendationMonitoringModule,
    RecommendationExperimentsModule,
  ],
})
export class RecommendationModule {}
