"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
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
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
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
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map