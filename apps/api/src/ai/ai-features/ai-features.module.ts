import { Module } from '@nestjs/common';
import { AiFeaturesService } from './ai-features.service';
import { AiFeaturesController } from './ai-features.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AiCoreModule } from '../ai-core/ai-core.module';
import { AiPromptsModule } from '../ai-prompts/ai-prompts.module';

@Module({
  imports: [PrismaModule, AiCoreModule, AiPromptsModule],
  providers: [AiFeaturesService],
  controllers: [AiFeaturesController],
  exports: [AiFeaturesService],
})
export class AiFeaturesModule {}
