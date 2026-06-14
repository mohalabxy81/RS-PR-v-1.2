import { Module } from '@nestjs/common';
import { AiAdminService } from './ai-admin.service';
import { AiAdminController } from './ai-admin.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AiPromptsModule } from '../ai-prompts/ai-prompts.module';

@Module({
  imports: [PrismaModule, AiPromptsModule],
  providers: [AiAdminService],
  controllers: [AiAdminController],
  exports: [AiAdminService],
})
export class AiAdminModule {}
