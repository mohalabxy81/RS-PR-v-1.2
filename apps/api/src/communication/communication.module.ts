import { Module } from '@nestjs/common';
import { CommunicationCoreModule } from './communication-core/communication-core.module';
import { CommunicationProvidersModule } from './communication-providers/communication-providers.module';
import { CommunicationWebhooksModule } from './communication-webhooks/communication-webhooks.module';
import { CommunicationConversationsModule } from './communication-conversations/communication-conversations.module';
import { CommunicationTemplatesModule } from './communication-templates/communication-templates.module';
import { CommunicationCampaignsModule } from './communication-campaigns/communication-campaigns.module';
import { CommunicationAutomationModule } from './communication-automation/communication-automation.module';
import { CommunicationAiModule } from './communication-ai/communication-ai.module';

@Module({
  imports: [
    CommunicationCoreModule,
    CommunicationProvidersModule,
    CommunicationWebhooksModule,
    CommunicationConversationsModule,
    CommunicationTemplatesModule,
    CommunicationCampaignsModule,
    CommunicationAutomationModule,
    CommunicationAiModule,
  ],
})
export class CommunicationModule {}
