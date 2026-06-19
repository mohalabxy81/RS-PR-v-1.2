import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../prisma/prisma.module';

// Controllers
import { DeveloperController } from './controllers/developer.controller';
import { ApiGatewayController } from './controllers/api-gateway.controller';
import { MarketplaceController } from './controllers/marketplace.controller';
import { WebhookController } from './controllers/webhook.controller';
import { PartnerController } from './controllers/partner.controller';

// Services
import { DeveloperService } from './services/developer.service';
import { ApiGatewayService } from './services/api-gateway.service';
import { MarketplaceService } from './services/marketplace.service';
import { WebhookService } from './services/webhook.service';
import { PartnerService } from './services/partner.service';
import { EventDispatcherService } from './services/event-dispatcher.service';

import { ApiKeyService } from './services/api-key.service';

// Workers
import { UsageWorker } from './workers/usage.worker';
import { WebhookWorker } from './workers/webhook.worker';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue(
      { name: 'api-usage-queue' },
      { name: 'webhook-queue' }
    ),
  ],
  controllers: [
    DeveloperController,
    ApiGatewayController,
    MarketplaceController,
    WebhookController,
    PartnerController,
  ],
  providers: [
    EventDispatcherService,
    DeveloperService,
    ApiGatewayService,
    ApiKeyService,
    MarketplaceService,
    WebhookService,
    PartnerService,
    UsageWorker,
    WebhookWorker,
  ],
  exports: [
    DeveloperService,
    ApiGatewayService,
    ApiKeyService,
    MarketplaceService,
    WebhookService,
    PartnerService,
  ],
})
export class PlatformModule {}
