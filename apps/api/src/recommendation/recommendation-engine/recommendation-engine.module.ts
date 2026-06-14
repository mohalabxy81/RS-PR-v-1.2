import { Module } from '@nestjs/common';
import { RecommendationSearchModule } from '../recommendation-search/recommendation-search.module';
import { RecommendationEngineService } from './recommendation-engine.service';

@Module({
  imports: [RecommendationSearchModule],
  providers: [RecommendationEngineService],
  exports: [RecommendationEngineService],
})
export class RecommendationEngineModule {}
