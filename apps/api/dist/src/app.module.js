"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const throttler_storage_redis_1 = require("@nest-lab/throttler-storage-redis");
const ioredis_1 = __importDefault(require("ioredis"));
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const tenants_module_1 = require("./tenants/tenants.module");
const users_module_1 = require("./users/users.module");
const properties_module_1 = require("./properties/properties.module");
const auth_module_1 = require("./auth/auth.module");
const config_module_1 = require("./config/config.module");
const queue_module_1 = require("./queue/queue.module");
const branches_module_1 = require("./branches/branches.module");
const leads_module_1 = require("./leads/leads.module");
const customers_module_1 = require("./customers/customers.module");
const deals_module_1 = require("./deals/deals.module");
const appointments_module_1 = require("./appointments/appointments.module");
const tasks_module_1 = require("./tasks/tasks.module");
const activities_module_1 = require("./activities/activities.module");
const notifications_module_1 = require("./notifications/notifications.module");
const reports_module_1 = require("./reports/reports.module");
const audit_logs_module_1 = require("./audit-logs/audit-logs.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const files_module_1 = require("./files/files.module");
const roles_module_1 = require("./roles/roles.module");
const permissions_guard_1 = require("./roles/guards/permissions.guard");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const ai_core_module_1 = require("./ai/ai-core/ai-core.module");
const ai_knowledge_module_1 = require("./ai/ai-knowledge/ai-knowledge.module");
const ai_memory_module_1 = require("./ai/ai-memory/ai-memory.module");
const ai_prompts_module_1 = require("./ai/ai-prompts/ai-prompts.module");
const ai_chat_module_1 = require("./ai/ai-chat/ai-chat.module");
const ai_features_module_1 = require("./ai/ai-features/ai-features.module");
const ai_analytics_module_1 = require("./ai/ai-analytics/ai-analytics.module");
const ai_feedback_module_1 = require("./ai/ai-feedback/ai-feedback.module");
const ai_admin_module_1 = require("./ai/ai-admin/ai-admin.module");
const ai_queue_module_1 = require("./ai/ai-queue/ai-queue.module");
const communication_core_module_1 = require("./communication/communication-core/communication-core.module");
const communication_providers_module_1 = require("./communication/communication-providers/communication-providers.module");
const communication_webhooks_module_1 = require("./communication/communication-webhooks/communication-webhooks.module");
const communication_conversations_module_1 = require("./communication/communication-conversations/communication-conversations.module");
const communication_templates_module_1 = require("./communication/communication-templates/communication-templates.module");
const communication_campaigns_module_1 = require("./communication/communication-campaigns/communication-campaigns.module");
const communication_automation_module_1 = require("./communication/communication-automation/communication-automation.module");
const communication_ai_module_1 = require("./communication/communication-ai/communication-ai.module");
const recommendation_core_module_1 = require("./recommendation/recommendation-core/recommendation-core.module");
const recommendation_engine_module_1 = require("./recommendation/recommendation-engine/recommendation-engine.module");
const recommendation_ranking_module_1 = require("./recommendation/recommendation-ranking/recommendation-ranking.module");
const recommendation_search_module_1 = require("./recommendation/recommendation-search/recommendation-search.module");
const recommendation_signals_module_1 = require("./recommendation/recommendation-signals/recommendation-signals.module");
const recommendation_ai_module_1 = require("./recommendation/recommendation-ai/recommendation-ai.module");
const recommendation_analytics_module_1 = require("./recommendation/recommendation-analytics/recommendation-analytics.module");
const recommendation_feedback_module_1 = require("./recommendation/recommendation-feedback/recommendation-feedback.module");
const recommendation_monitoring_module_1 = require("./recommendation/recommendation-monitoring/recommendation-monitoring.module");
const recommendation_experiments_module_1 = require("./recommendation/recommendation-experiments/recommendation-experiments.module");
const branding_module_1 = require("./branding/branding.module");
const enterprise_module_1 = require("./enterprise/enterprise.module");
const platform_module_1 = require("./platform/platform.module");
const logger_module_1 = require("./common/logger/logger.module");
const redis_cache_module_1 = require("./common/cache/redis-cache.module");
const tenant_resolution_interceptor_1 = require("./common/interceptors/tenant-resolution.interceptor");
const enterprise_throttler_guard_1 = require("./common/guards/enterprise-throttler.guard");
const event_emitter_1 = require("@nestjs/event-emitter");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            event_emitter_1.EventEmitterModule.forRoot({
                wildcard: true,
                delimiter: '.',
            }),
            logger_module_1.LoggerModule,
            redis_cache_module_1.RedisCacheModule,
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        ttl: 60000,
                        limit: 100,
                    },
                ],
                storage: new throttler_storage_redis_1.ThrottlerStorageRedisService(new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379')),
            }),
            prisma_module_1.PrismaModule,
            config_module_1.ConfigModule,
            auth_module_1.AuthModule,
            tenants_module_1.TenantsModule,
            users_module_1.UsersModule,
            branches_module_1.BranchesModule,
            roles_module_1.RolesModule,
            properties_module_1.PropertiesModule,
            leads_module_1.LeadsModule,
            customers_module_1.CustomersModule,
            deals_module_1.DealsModule,
            appointments_module_1.AppointmentsModule,
            tasks_module_1.TasksModule,
            activities_module_1.ActivitiesModule,
            notifications_module_1.NotificationsModule,
            reports_module_1.ReportsModule,
            audit_logs_module_1.AuditLogsModule,
            dashboard_module_1.DashboardModule,
            files_module_1.FilesModule,
            queue_module_1.QueueModule,
            ai_core_module_1.AiCoreModule,
            ai_knowledge_module_1.AiKnowledgeModule,
            ai_memory_module_1.AiMemoryModule,
            ai_prompts_module_1.AiPromptsModule,
            ai_chat_module_1.AiChatModule,
            ai_features_module_1.AiFeaturesModule,
            ai_analytics_module_1.AiAnalyticsModule,
            ai_feedback_module_1.AiFeedbackModule,
            ai_admin_module_1.AiAdminModule,
            ai_queue_module_1.AiQueueModule,
            communication_core_module_1.CommunicationCoreModule,
            communication_providers_module_1.CommunicationProvidersModule,
            communication_webhooks_module_1.CommunicationWebhooksModule,
            communication_conversations_module_1.CommunicationConversationsModule,
            communication_templates_module_1.CommunicationTemplatesModule,
            communication_campaigns_module_1.CommunicationCampaignsModule,
            communication_automation_module_1.CommunicationAutomationModule,
            communication_ai_module_1.CommunicationAiModule,
            recommendation_core_module_1.RecommendationCoreModule,
            recommendation_engine_module_1.RecommendationEngineModule,
            recommendation_ranking_module_1.RecommendationRankingModule,
            recommendation_search_module_1.RecommendationSearchModule,
            recommendation_signals_module_1.RecommendationSignalsModule,
            recommendation_ai_module_1.RecommendationAiModule,
            recommendation_analytics_module_1.RecommendationAnalyticsModule,
            recommendation_feedback_module_1.RecommendationFeedbackModule,
            recommendation_monitoring_module_1.RecommendationMonitoringModule,
            recommendation_experiments_module_1.RecommendationExperimentsModule,
            branding_module_1.BrandingModule,
            enterprise_module_1.EnterpriseModule,
            platform_module_1.PlatformModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: enterprise_throttler_guard_1.EnterpriseThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: permissions_guard_1.PermissionsGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: tenant_resolution_interceptor_1.TenantResolutionInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map