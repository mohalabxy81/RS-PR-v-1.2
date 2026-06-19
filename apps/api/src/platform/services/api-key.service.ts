import { Injectable, NotFoundException, BadRequestException, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomBytes, createHash } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class ApiKeyService {
  private readonly logger = new Logger(ApiKeyService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private hashKey(key: string): string {
    return createHash('sha256').update(key).digest('hex');
  }

  private generatePrefix(): string {
    return 'reis_' + randomBytes(4).toString('hex') + '_';
  }

  async createApiKey(tenantId: string, name: string, scopes: string[] = [], expiresInDays?: number) {
    const rawKey = randomBytes(32).toString('base64url');
    const prefix = this.generatePrefix();
    const fullKey = prefix + rawKey;
    const keyHash = this.hashKey(fullKey);

    let expiresAt: Date | undefined;
    if (expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    const apiKeyRecord = await this.prisma.apiKey.create({
      data: {
        tenantId,
        name,
        keyHash,
        prefix,
        scopes,
        expiresAt,
        status: 'ACTIVE',
      },
    });

    this.logger.log(`Created new API Key ${apiKeyRecord.id} for tenant ${tenantId}`);

    // Return the full plaintext key only once upon creation
    return {
      id: apiKeyRecord.id,
      name: apiKeyRecord.name,
      scopes: apiKeyRecord.scopes,
      prefix: apiKeyRecord.prefix,
      expiresAt: apiKeyRecord.expiresAt,
      key: fullKey,
    };
  }

  async validateApiKey(key: string): Promise<any> {
    const keyHash = this.hashKey(key);
    const cacheKey = `apikey_valid:${keyHash}`;

    let apiKeyRecord = await this.cacheManager.get<any>(cacheKey);

    if (!apiKeyRecord) {
      apiKeyRecord = await this.prisma.apiKey.findUnique({
        where: { keyHash },
      });

      if (!apiKeyRecord) return null;
      if (apiKeyRecord.status !== 'ACTIVE') return null;

      if (apiKeyRecord.expiresAt && new Date(apiKeyRecord.expiresAt) < new Date()) {
        await this.revokeApiKey(apiKeyRecord.id);
        return null;
      }

      await this.cacheManager.set(cacheKey, apiKeyRecord, 60000); // 1 minute
    }

    return apiKeyRecord;
  }

  async listApiKeys(tenantId: string) {
    return this.prisma.apiKey.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        prefix: true,
        scopes: true,
        status: true,
        expiresAt: true,
        lastUsedAt: true,
        createdAt: true,
      },
    });
  }

  async revokeApiKey(id: string) {
    const key = await this.prisma.apiKey.update({
      where: { id },
      data: { status: 'REVOKED' },
    });
    // Invalidate cache
    await this.cacheManager.del(`apikey_valid:${key.keyHash}`);
    return key;
  }

  async rotateApiKey(tenantId: string, id: string, gracePeriodHours: number = 24) {
    const oldKey = await this.prisma.apiKey.findUnique({ where: { id, tenantId } });
    if (!oldKey || oldKey.status !== 'ACTIVE') {
      throw new NotFoundException('Active API Key not found');
    }

    // Create new key
    const newKey = await this.createApiKey(tenantId, oldKey.name, oldKey.scopes);

    // Set expiry on old key
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + gracePeriodHours);

    await this.prisma.apiKey.update({
      where: { id },
      data: { expiresAt },
    });

    await this.cacheManager.del(`apikey_valid:${oldKey.keyHash}`);

    return newKey;
  }

  async getUsageHistory(tenantId: string, apiKeyId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.prisma.apiUsageLog.groupBy({
      by: ['method', 'statusCode'],
      where: {
        tenantId,
        apiKeyId,
        timestamp: { gte: startDate },
      },
      _count: { id: true },
      _sum: { requestSize: true, responseSize: true, costUnit: true },
    });
  }
}
