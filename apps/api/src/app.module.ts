import { Module } from '@nestjs/common';
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

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
