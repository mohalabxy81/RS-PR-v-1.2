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
const event_emitter_1 = require("@nestjs/event-emitter");
const core_module_1 = require("./core/core.module");
const crm_module_1 = require("./crm/crm.module");
const ai_module_1 = require("./ai/ai.module");
const communication_module_1 = require("./communication/communication.module");
const recommendation_module_1 = require("./recommendation/recommendation.module");
const branding_module_1 = require("./branding/branding.module");
const enterprise_module_1 = require("./enterprise/enterprise.module");
const platform_module_1 = require("./platform/platform.module");
const tenant_resolution_interceptor_1 = require("./common/interceptors/tenant-resolution.interceptor");
const request_id_interceptor_1 = require("./common/interceptors/request-id.interceptor");
const response_transform_interceptor_1 = require("./common/interceptors/response-transform.interceptor");
const usage_metering_interceptor_1 = require("./common/interceptors/usage-metering.interceptor");
const enterprise_throttler_guard_1 = require("./common/guards/enterprise-throttler.guard");
const permissions_guard_1 = require("./roles/guards/permissions.guard");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
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
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        ttl: 60000,
                        limit: 100,
                    },
                ],
                storage: new throttler_storage_redis_1.ThrottlerStorageRedisService(new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379')),
            }),
            core_module_1.CoreModule,
            crm_module_1.CrmModule,
            ai_module_1.AiModule,
            communication_module_1.CommunicationModule,
            recommendation_module_1.RecommendationModule,
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
                useClass: request_id_interceptor_1.RequestIdInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: response_transform_interceptor_1.ResponseTransformInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: tenant_resolution_interceptor_1.TenantResolutionInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: usage_metering_interceptor_1.UsageMeteringInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map