import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../../prisma/prisma.module';
import { CommunicationConversationsController } from './communication-conversations.controller';
import { CommunicationConversationsService } from './communication-conversations.service';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({ name: 'outbound-messages' }),
  ],
  controllers: [CommunicationConversationsController],
  providers: [CommunicationConversationsService],
  exports: [CommunicationConversationsService],
})
export class CommunicationConversationsModule {}
