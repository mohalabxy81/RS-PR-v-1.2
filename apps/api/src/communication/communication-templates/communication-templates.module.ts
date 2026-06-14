import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CommunicationTemplatesController } from './communication-templates.controller';
import { CommunicationTemplatesService } from './communication-templates.service';

@Module({
  imports: [PrismaModule],
  controllers: [CommunicationTemplatesController],
  providers: [CommunicationTemplatesService],
  exports: [CommunicationTemplatesService],
})
export class CommunicationTemplatesModule {}
