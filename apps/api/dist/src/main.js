"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const nestjs_pino_1 = require("nestjs-pino");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { bufferLogs: true });
    app.useLogger(app.get(nestjs_pino_1.Logger));
    app.useGlobalInterceptors(new nestjs_pino_1.LoggerErrorInterceptor());
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'"],
                objectSrc: ["'none'"],
                frameAncestors: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
        frameguard: { action: 'deny' },
        noSniff: true,
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
        permittedCrossDomainPolicies: false,
    }));
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error(`CORS blocked: origin '${origin}' not allowed`));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID'],
    });
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: common_1.VersioningType.URI, defaultVersion: '1' });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    if (process.env.NODE_ENV !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('REIS Enterprise SaaS API')
            .setDescription('Multi-Tenant Real Estate CRM Platform — API v1')
            .setVersion('1.0')
            .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
            .addTag('auth', 'Authentication & Session Management')
            .addTag('leads', 'Lead Management')
            .addTag('customers', 'Customer Management')
            .addTag('properties', 'Property Management')
            .addTag('deals', 'Deal Pipeline')
            .addTag('appointments', 'Appointment & Calendar')
            .addTag('tasks', 'Task Management')
            .addTag('users', 'User Management')
            .addTag('roles', 'RBAC - Roles & Permissions')
            .addTag('tenants', 'Tenant Management')
            .addTag('branches', 'Branch Management')
            .addTag('reports', 'Reporting & Analytics')
            .addTag('dashboard', 'Dashboard Metrics')
            .addTag('notifications', 'Notification Center')
            .addTag('audit-logs', 'Audit Log')
            .addTag('files', 'File Management')
            .addTag('platform-developers', 'Developer Portal - Accounts, Orgs & Projects')
            .addTag('platform-gateway', 'API Gateway - Keys, OAuth Clients & Plans')
            .addTag('platform-marketplace', 'App Marketplace - Publish & Install Apps')
            .addTag('platform-webhooks', 'Webhooks & Event Subscriptions')
            .addTag('platform-partners', 'Partner Ecosystem & Programs')
            .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'api-key')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document, {
            swaggerOptions: { persistAuthorization: true },
        });
    }
    const port = process.env.PORT || 3001;
    await app.listen(port);
    const logger = app.get(nestjs_pino_1.Logger);
    logger.log(`🚀 REIS API running on: http://localhost:${port}/api/v1`);
    if (process.env.NODE_ENV !== 'production') {
        logger.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map