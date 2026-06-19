import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TenantsModule } from './tenants/tenants.module';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { QueueModule } from './queue/queue.module';
import { BranchesModule } from './branches/branches.module';
import { LeadsModule } from './leads/leads.module';
import { CustomersModule } from './customers/customers.module';
import { DealsModule } from './deals/deals.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { TasksModule } from './tasks/tasks.module';
import { ActivitiesModule } from './activities/activities.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FilesModule } from './files/files.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsGuard } from './roles/guards/permissions.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AiCoreModule } from './ai/ai-core/ai-core.module';
import { AiKnowledgeModule } from './ai/ai-knowledge/ai-knowledge.module';
import { AiMemoryModule } from './ai/ai-memory/ai-memory.module';
import { AiPromptsModule } from './ai/ai-prompts/ai-prompts.module';
import { AiChatModule } from './ai/ai-chat/ai-chat.module';
import { AiFeaturesModule } from './ai/ai-features/ai-features.module';
import { AiAnalyticsModule } from './ai/ai-analytics/ai-analytics.module';
import { AiFeedbackModule } from './ai/ai-feedback/ai-feedback.module';
import { AiAdminModule } from './ai/ai-admin/ai-admin.module';
import { AiQueueModule } from './ai/ai-queue/ai-queue.module';
import { CommunicationCoreModule } from './communication/communication-core/communication-core.module';
import { CommunicationProvidersModule } from './communication/communication-providers/communication-providers.module';
import { CommunicationWebhooksModule } from './communication/communication-webhooks/communication-webhooks.module';
import { CommunicationConversationsModule } from './communication/communication-conversations/communication-conversations.module';
import { CommunicationTemplatesModule } from './communication/communication-templates/communication-templates.module';
import { CommunicationCampaignsModule } from './communication/communication-campaigns/communication-campaigns.module';
import { CommunicationAutomationModule } from './communication/communication-automation/communication-automation.module';
import { CommunicationAiModule } from './communication/communication-ai/communication-ai.module';
import { RecommendationCoreModule } from './recommendation/recommendation-core/recommendation-core.module';
import { RecommendationEngineModule } from './recommendation/recommendation-engine/recommendation-engine.module';
import { RecommendationRankingModule } from './recommendation/recommendation-ranking/recommendation-ranking.module';
import { RecommendationSearchModule } from './recommendation/recommendation-search/recommendation-search.module';
import { RecommendationSignalsModule } from './recommendation/recommendation-signals/recommendation-signals.module';
import { RecommendationAiModule } from './recommendation/recommendation-ai/recommendation-ai.module';
import { RecommendationAnalyticsModule } from './recommendation/recommendation-analytics/recommendation-analytics.module';
import { RecommendationFeedbackModule } from './recommendation/recommendation-feedback/recommendation-feedback.module';
import { RecommendationMonitoringModule } from './recommendation/recommendation-monitoring/recommendation-monitoring.module';
import { RecommendationExperimentsModule } from './recommendation/recommendation-experiments/recommendation-experiments.module';
import { BrandingModule } from './branding/branding.module';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { PlatformModule } from './platform/platform.module';

import { LoggerModule } from './common/logger/logger.module';
import { RedisCacheModule } from './common/cache/redis-cache.module';
import { TenantResolutionInterceptor } from './common/interceptors/tenant-resolution.interceptor';
import { EnterpriseThrottlerGuard } from './common/guards/enterprise-throttler.guard';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
    LoggerModule,
    RedisCacheModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100, // default limit, can be overridden per route
        },
      ],
      storage: new ThrottlerStorageRedisService(
        new Redis(process.env.REDIS_URL || 'redis://localhost:6379'),
      ),
    }),
    PrismaModule,
    ConfigModule,
    AuthModule,
    TenantsModule,
    UsersModule,
    BranchesModule,
    RolesModule,
    PropertiesModule,
    LeadsModule,
    CustomersModule,
    DealsModule,
    AppointmentsModule,
    TasksModule,
    ActivitiesModule,
    NotificationsModule,
    ReportsModule,
    AuditLogsModule,
    DashboardModule,
    FilesModule,
    QueueModule,
    AiCoreModule,
    AiKnowledgeModule,
    AiMemoryModule,
    AiPromptsModule,
    AiChatModule,
    AiFeaturesModule,
    AiAnalyticsModule,
    AiFeedbackModule,
    AiAdminModule,
    AiQueueModule,
    CommunicationCoreModule,
    CommunicationProvidersModule,
    CommunicationWebhooksModule,
    CommunicationConversationsModule,
    CommunicationTemplatesModule,
    CommunicationCampaignsModule,
    CommunicationAutomationModule,
    CommunicationAiModule,
    RecommendationCoreModule,
    RecommendationEngineModule,
    RecommendationRankingModule,
    RecommendationSearchModule,
    RecommendationSignalsModule,
    RecommendationAiModule,
    RecommendationAnalyticsModule,
    RecommendationFeedbackModule,
    RecommendationMonitoringModule,
    RecommendationExperimentsModule,
    BrandingModule,
    EnterpriseModule,
    PlatformModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global Rate Limiting
    {
      provide: APP_GUARD,
      useClass: EnterpriseThrottlerGuard,
    },
    // Global JWT Auth — all routes protected unless @Public()
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global RBAC — permissions checked after auth
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    // Tenant Resolution
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantResolutionInterceptor,
    },
  ],
})
export class AppModule {}
