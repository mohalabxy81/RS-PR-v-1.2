import { Module } from '@nestjs/common';
import { AiCoreService } from './ai-core.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AiCoreService],
  exports: [AiCoreService],
})
export class AiCoreModule {}
