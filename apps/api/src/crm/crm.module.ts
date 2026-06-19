import { Module } from '@nestjs/common';
import { BranchesModule } from '../branches/branches.module';
import { LeadsModule } from '../leads/leads.module';
import { CustomersModule } from '../customers/customers.module';
import { DealsModule } from '../deals/deals.module';
import { AppointmentsModule } from '../appointments/appointments.module';
import { TasksModule } from '../tasks/tasks.module';
import { ActivitiesModule } from '../activities/activities.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ReportsModule } from '../reports/reports.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { FilesModule } from '../files/files.module';
import { PropertiesModule } from '../properties/properties.module';

@Module({
  imports: [
    BranchesModule,
    LeadsModule,
    CustomersModule,
    DealsModule,
    AppointmentsModule,
    TasksModule,
    ActivitiesModule,
    NotificationsModule,
    ReportsModule,
    DashboardModule,
    FilesModule,
    PropertiesModule,
  ],
})
export class CrmModule {}
