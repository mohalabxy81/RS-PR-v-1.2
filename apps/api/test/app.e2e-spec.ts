import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('GET /api/health → 200', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
          expect(res.body.timestamp).toBeDefined();
        });
    });
  });

  describe('Auth — Public Routes', () => {
    const validRegistration = {
      companyName: 'Test Corp',
      companySlug: `test-corp-e2e-${Date.now()}`,
      firstName: 'Test',
      lastName: 'User',
      email: `test-e2e-${Date.now()}@example.com`,
      password: 'StrongPassword123!',
    };

    it('POST /api/v1/auth/register → 201', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(validRegistration)
        .expect(201);

      expect(res.body.message).toContain('Registration successful');
    });

    it('POST /api/v1/auth/login → 200', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: validRegistration.email,
          password: validRegistration.password,
        })
        .expect(200);

      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });

    it('POST /api/v1/auth/login with wrong password → 401', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: validRegistration.email,
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('POST /api/v1/auth/forgot-password → always 200 (no user enumeration)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' })
        .expect(200);
    });
  });

  describe('Protected Routes — Unauthenticated', () => {
    it('GET /api/v1/leads → 401 without token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/leads')
        .expect(401);
    });

    it('GET /api/v1/users → 401 without token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/users')
        .expect(401);
    });
  });

  describe('Security Headers', () => {
    it('All responses include X-Frame-Options header', async () => {
      const res = await request(app.getHttpServer()).get('/api/health');
      expect(res.headers['x-frame-options']).toBeDefined();
    });

    it('All responses include X-Content-Type-Options header', async () => {
      const res = await request(app.getHttpServer()).get('/api/health');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
    });
  });
});
