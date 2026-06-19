import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '../config/config.module';
import { AuthModule } from '../auth/auth.module';
import { TenantsModule } from '../tenants/tenants.module';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { QueueModule } from '../queue/queue.module';
import { LoggerModule } from '../common/logger/logger.module';
import { RedisCacheModule } from '../common/cache/redis-cache.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { CryptoModule } from '../common/crypto/crypto.module';
import { HealthModule } from '../health/health.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    AuthModule,
    TenantsModule,
    UsersModule,
    RolesModule,
    QueueModule,
    LoggerModule,
    RedisCacheModule,
    AuditLogsModule,
    CryptoModule,
    HealthModule,
  ],
})
export class CoreModule {}
