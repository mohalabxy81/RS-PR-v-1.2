import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD', ''),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: 'inbound-messages' },
      { name: 'outbound-messages' },
      { name: 'webhooks' },
      { name: 'campaigns' },
      { name: 'automations' },
      { name: 'api-usage-queue' },
      { name: 'webhook-queue' },
      { name: 'email-queue' },
      { name: 'notification-queue' },
      { name: 'report-queue' },
      { name: 'cleanup-queue' },
      // Phase 4: Recommendation Queues
      { name: 'embedding-generation' },
      { name: 'feature-extraction' },
      { name: 'ranking-jobs' },
      { name: 'recommendation-generation' },
      { name: 'intent-prediction' },
      { name: 'feedback-processing' },
    ),
  ],
  exports: [BullModule],
})
export class QueueModule {}
