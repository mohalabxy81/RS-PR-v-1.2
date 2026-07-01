sudo apt import { Module, Global } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogsService } from './audit-logs.service';
import { SecurityAuditService } from './security-audit.service';
import { SecurityMonitorService } from '../common/security/security-monitor.service';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [AuditLogsService, SecurityAuditService, SecurityMonitorService],
  exports: [AuditLogsService, SecurityAuditService, SecurityMonitorService],
})
export class AuditLogsModule {}
