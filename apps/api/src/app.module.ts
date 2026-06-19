import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { CoreModule } from './core/core.module';
import { CrmModule } from './crm/crm.module';
import { AiModule } from './ai/ai.module';
import { CommunicationModule } from './communication/communication.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { BrandingModule } from './branding/branding.module';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { PlatformModule } from './platform/platform.module';

import { TenantResolutionInterceptor } from './common/interceptors/tenant-resolution.interceptor';
import { RequestIdInterceptor } from './common/interceptors/request-id.interceptor';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { UsageMeteringInterceptor } from './common/interceptors/usage-metering.interceptor';
import { EnterpriseThrottlerGuard } from './common/guards/enterprise-throttler.guard';
import { PermissionsGuard } from './roles/guards/permissions.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
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
    CoreModule,
    CrmModule,
    AiModule,
    CommunicationModule,
    RecommendationModule,
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
    // Request ID & Correlation ID injection
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestIdInterceptor,
    },
    // Standardize API success responses
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    // Tenant Resolution
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantResolutionInterceptor,
    },
    // Usage Metering
    {
      provide: APP_INTERCEPTOR,
      useClass: UsageMeteringInterceptor,
    },
  ],
})
export class AppModule {}
