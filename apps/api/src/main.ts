import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // ─────────────────────────────────────────────
  // Security Headers (MUST - per secure coding guidelines)
  // ─────────────────────────────────────────────
  app.use(
    helmet({
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
      frameguard: { action: 'deny' },    // X-Frame-Options: DENY
      noSniff: true,                     // X-Content-Type-Options: nosniff
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      permittedCrossDomainPolicies: false,
    }),
  );

  // ─────────────────────────────────────────────
  // CORS — strict allowlist from env (no wildcard)
  // ─────────────────────────────────────────────
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: origin '${origin}' not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID'],
  });

  // ─────────────────────────────────────────────
  // Global Prefix & API Versioning
  // ─────────────────────────────────────────────
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // ─────────────────────────────────────────────
  // Global Validation
  // ─────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ─────────────────────────────────────────────
  // Global Exception Filter — never expose stack traces
  // ─────────────────────────────────────────────
  app.useGlobalFilters(new GlobalExceptionFilter());

  // ─────────────────────────────────────────────
  // Swagger Documentation
  // ─────────────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
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
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 REIS API running on: http://localhost:${port}/api/v1`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
  }
}

bootstrap();
