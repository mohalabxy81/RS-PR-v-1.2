import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { RecommendationSearchService } from './recommendation-search.service';

@Module({
  imports: [PrismaModule],
  providers: [RecommendationSearchService],
  exports: [RecommendationSearchService],
})
export class RecommendationSearchModule {}
