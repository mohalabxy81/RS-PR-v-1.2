import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CommunicationWebhooksController } from './communication-webhooks.controller';
import { CommunicationWebhooksService } from './communication-webhooks.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'webhooks',
    }),
  ],
  controllers: [CommunicationWebhooksController],
  providers: [CommunicationWebhooksService],
})
export class CommunicationWebhooksModule {}
