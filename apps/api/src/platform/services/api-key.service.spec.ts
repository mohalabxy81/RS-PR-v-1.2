import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyService } from './api-key.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ApiKeyService', () => {
  let service: ApiKeyService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrisma = {
      apiKey: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ApiKeyService>(ApiKeyService);
    prismaService = module.get(PrismaService) as any;
  });

  describe('createApiKey', () => {
    it('should create an API key and return the plaintext key only once', async () => {
      const mockRecord = {
        id: 'key-id-123',
        name: 'My Test Key',
        scopes: ['read:leads'],
        prefix: 'reis_abc123_',
        expiresAt: null,
      };

      (prismaService.apiKey.create as jest.Mock).mockResolvedValue(mockRecord);

      const result = await service.createApiKey('tenant-1', 'My Test Key', ['read:leads']);

      expect(result.id).toBe('key-id-123');
      expect(result.key).toBeDefined();
      expect(result.key.length).toBeGreaterThan(20);
      expect(prismaService.apiKey.create).toHaveBeenCalledTimes(1);
      
      const createCall = (prismaService.apiKey.create as jest.Mock).mock.calls[0][0];
      // The plaintext key must NEVER be stored
      expect(createCall.data.key).toBeUndefined();
      // The hash must be stored
      expect(createCall.data.keyHash).toBeDefined();
      expect(createCall.data.keyHash.length).toBe(64); // sha256 hex
    });

    it('should set expiresAt when expiresInDays is provided', async () => {
      (prismaService.apiKey.create as jest.Mock).mockResolvedValue({
        id: 'key-2', name: 'Expiring', scopes: [], prefix: 'reis_test_', expiresAt: null,
      });

      await service.createApiKey('tenant-1', 'Expiring', [], 30);

      const createCall = (prismaService.apiKey.create as jest.Mock).mock.calls[0][0];
      expect(createCall.data.expiresAt).toBeDefined();
      
      const now = new Date();
      const expiry = createCall.data.expiresAt as Date;
      const daysDiff = Math.round((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      expect(daysDiff).toBeCloseTo(30, 0);
    });
  });

  describe('validateApiKey', () => {
    it('should return null for non-existent key', async () => {
      (prismaService.apiKey.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await service.validateApiKey('nonexistent-key');
      expect(result).toBeNull();
    });

    it('should return null for revoked key', async () => {
      (prismaService.apiKey.findUnique as jest.Mock).mockResolvedValue({
        id: 'key-1', status: 'REVOKED', expiresAt: null,
      });
      const result = await service.validateApiKey('some-key');
      expect(result).toBeNull();
    });

    it('should return null for expired key', async () => {
      const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24);
      (prismaService.apiKey.findUnique as jest.Mock).mockResolvedValue({
        id: 'key-1', status: 'ACTIVE', expiresAt: pastDate,
      });
      (prismaService.apiKey.update as jest.Mock).mockResolvedValue({});
      
      const result = await service.validateApiKey('some-key');
      expect(result).toBeNull();
    });

    it('should return the key record for valid, active, non-expired key', async () => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
      const mockKey = { id: 'key-1', status: 'ACTIVE', expiresAt: futureDate, tenantId: 'tenant-1' };
      (prismaService.apiKey.findUnique as jest.Mock).mockResolvedValue(mockKey);
      
      const result = await service.validateApiKey('some-valid-key');
      expect(result).toEqual(mockKey);
    });
  });

  describe('revokeApiKey', () => {
    it('should set status to REVOKED', async () => {
      (prismaService.apiKey.update as jest.Mock).mockResolvedValue({ id: 'key-1', status: 'REVOKED' });
      
      const result = await service.revokeApiKey('key-1');
      
      expect(prismaService.apiKey.update).toHaveBeenCalledWith({
        where: { id: 'key-1' },
        data: { status: 'REVOKED' },
      });
      expect(result.status).toBe('REVOKED');
    });
  });
});
