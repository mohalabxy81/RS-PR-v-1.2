import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SessionBlocklistService } from './session-blocklist.service';
import { SecurityAuditService } from '../audit-logs/security-audit.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock bcrypt to avoid slow hashing in tests
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('$2b$12$hashedpassword'),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: any;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockPrisma = {
      tenant: { findUnique: jest.fn(), create: jest.fn() },
      user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
      role: { create: jest.fn() },
      auditLog: { create: jest.fn() },
      refreshToken: {
        create: jest.fn(), findUnique: jest.fn(), updateMany: jest.fn(), update: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const mockSessionBlocklist = {
      isBlocked: jest.fn().mockResolvedValue(false),
      block: jest.fn().mockResolvedValue(undefined),
    };

    const mockSecurityAudit = {
      logSecurityEvent: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('mock.jwt.token'), verify: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config: Record<string, string> = {
                'jwt.accessSecret': 'test-access-secret',
                'jwt.refreshSecret': 'test-refresh-secret',
                'jwt.accessExpiresIn': '15m',
                'jwt.refreshExpiresIn': '7d',
              };
              return config[key];
            }),
          },
        },
        { provide: SessionBlocklistService, useValue: mockSessionBlocklist },
        { provide: SecurityAuditService, useValue: mockSecurityAudit },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService) as any;
    configService = module.get(ConfigService) as any;
  });

  describe('login', () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: '$2b$12$hashedpassword',
      status: 'ACTIVE',
      tenantId: 'tenant-1',
      roleId: 'role-1',
      role: { name: 'Company Owner' },
      tenant: { status: 'ACTIVE' },
    };

    it('should throw UnauthorizedException for non-existent user', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login({ email: 'x@y.com', password: 'any' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login({ email: 'test@example.com', password: 'wrong' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should use the same error message for missing user and wrong password (no user enumeration)', async () => {
      // Non-existent user
      prismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      let error1: any;
      try { await service.login({ email: 'none@x.com', password: 'p' }); } 
      catch (e) { error1 = e; }

      // Wrong password
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      let error2: any;
      try { await service.login({ email: 'test@example.com', password: 'wrong' }); }
      catch (e) { error2 = e; }

      expect(error1.message).toBe(error2.message);
    });

    it('should return tokens on successful login', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      prismaService.refreshToken.create.mockResolvedValue({});
      prismaService.user.update.mockResolvedValue({});

      const result = await service.login({ email: 'test@example.com', password: 'correct' });

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      // Must not expose passwordHash
      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('should throw for suspended user', async () => {
      prismaService.user.findUnique.mockResolvedValue({
        ...mockUser, status: 'SUSPENDED',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(service.login({ email: 'test@example.com', password: 'correct' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should revoke the refresh token', async () => {
      prismaService.refreshToken.updateMany.mockResolvedValue({ count: 1 });
      await service.logout(undefined, 'some-refresh-token');
      expect(prismaService.refreshToken.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ data: { revokedAt: expect.any(Date) } }),
      );
    });
  });
});
