import { Injectable, NotFoundException, BadRequestException, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { validateScopes } from '../constants/api-scopes.constants';
import { SecurityAuditService, SecurityEvent } from '../../audit-logs/security-audit.service';
import { PrismaService } from '../../prisma/prisma.service';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class ApiKeyService {
  private readonly logger = new Logger(ApiKeyService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly securityAudit: SecurityAuditService,
  ) {}

  private hashKey(key: string): string {
    return createHash('sha256').update(key).digest('hex');
  }

  private generatePrefix(): string {
    return 'reis_' + randomBytes(4).toString('hex') + '_';
  }

  async createApiKey(
    tenantId: string, 
    name: string, 
    scopes: string[] = [], 
    expiresInDays?: number,
    ipWhitelist: string[] = [],
    referrers: string[] = [],
    createdIp?: string,
    createdUserAgent?: string
  ) {
    if (!validateScopes(scopes)) {
      throw new BadRequestException('Invalid API key scopes provided or wildcard scopes requested.');
    }

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
        ipWhitelist,
        referrers,
        createdIp,
        createdUserAgent,
        expiresAt,
        status: 'ACTIVE',
      },
    });

    this.logger.log(`Created new API Key ${apiKeyRecord.id} for tenant ${tenantId}`);

    await this.securityAudit.logSecurityEvent(tenantId, SecurityEvent.API_KEY_CREATED, apiKeyRecord.id, {
      ipAddress: createdIp,
      userAgent: createdUserAgent,
      severity: 'INFO'
    });

    return {
      id: apiKeyRecord.id,
      name: apiKeyRecord.name,
      scopes: apiKeyRecord.scopes,
      prefix: apiKeyRecord.prefix,
      expiresAt: apiKeyRecord.expiresAt,
      ipWhitelist: apiKeyRecord.ipWhitelist,
      referrers: apiKeyRecord.referrers,
      key: fullKey,
    };
  }

  async validateApiKey(key: string, requestIp?: string, requestReferer?: string): Promise<any> {
    const keyHash = this.hashKey(key);
    const cacheKey = `apikey_valid:${keyHash}`;

    let apiKeyRecord = await this.cacheManager.get<any>(cacheKey);

    if (!apiKeyRecord) {
      apiKeyRecord = await this.prisma.apiKey.findUnique({
        where: { keyHash },
        include: { tenant: true },
      });

      if (!apiKeyRecord) return null;
      if (apiKeyRecord.status !== 'ACTIVE') return null;
      if (apiKeyRecord.tenant.status === 'SUSPENDED' || apiKeyRecord.tenant.status === 'CANCELLED') {
        this.logger.warn(`API key ${apiKeyRecord.id} rejected: Tenant is ${apiKeyRecord.tenant.status}`);
        return null;
      }

      if (apiKeyRecord.expiresAt && new Date(apiKeyRecord.expiresAt) < new Date()) {
        await this.revokeApiKey(apiKeyRecord.tenantId, apiKeyRecord.id);
        return null;
      }

      await this.cacheManager.set(cacheKey, apiKeyRecord, 60000); // 1 minute
    }

    // Validate IP whitelist if specified
    if (apiKeyRecord.ipWhitelist && apiKeyRecord.ipWhitelist.length > 0) {
      if (!requestIp || !apiKeyRecord.ipWhitelist.includes(requestIp)) {
        this.logger.warn(`API key ${apiKeyRecord.id} rejected due to IP mismatch: ${requestIp}`);
        return null;
      }
    }

    // Validate Referrer if specified
    if (apiKeyRecord.referrers && apiKeyRecord.referrers.length > 0) {
      if (!requestReferer || !apiKeyRecord.referrers.some((ref: string) => requestReferer.includes(ref))) {
        this.logger.warn(`API key ${apiKeyRecord.id} rejected due to Referer mismatch: ${requestReferer}`);
        return null;
      }
    }

    return apiKeyRecord;
  }

  hasScope(apiKeyRecord: any, requiredScope: string): boolean {
    if (!apiKeyRecord || !apiKeyRecord.scopes) return false;
    return apiKeyRecord.scopes.includes(requiredScope);
  }

  async listApiKeys(tenantId: string) {
    return this.prisma.apiKey.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        prefix: true,
        scopes: true,
        ipWhitelist: true,
        referrers: true,
        status: true,
        expiresAt: true,
        lastUsedAt: true,
        createdAt: true,
      },
    });
  }

  async revokeApiKey(tenantId: string, id: string) {
    const existing = await this.prisma.apiKey.findFirst({ where: { id, tenantId } });
    if (!existing) throw new NotFoundException('API Key not found');

    const key = await this.prisma.apiKey.update({
      where: { id },
      data: { status: 'REVOKED' },
    });
    // Invalidate cache
    await this.cacheManager.del(`apikey_valid:${key.keyHash}`);

    await this.securityAudit.logSecurityEvent(tenantId, SecurityEvent.API_KEY_REVOKED, id, {
      severity: 'MEDIUM',
      reason: 'User revoked API key'
    });

    return key;
  }

  async rotateApiKey(tenantId: string, id: string, gracePeriodHours: number = 24) {
    const oldKey = await this.prisma.apiKey.findUnique({ where: { id, tenantId } });
    if (!oldKey || oldKey.status !== 'ACTIVE') {
      throw new NotFoundException('Active API Key not found');
    }

    // Create new key inheriting settings
    const newKey = await this.createApiKey(
      tenantId, 
      oldKey.name, 
      oldKey.scopes, 
      undefined, 
      oldKey.ipWhitelist,
      oldKey.referrers
    );

    // Set expiry on old key
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + gracePeriodHours);

    await this.prisma.apiKey.update({
      where: { id },
      data: { expiresAt },
    });

    await this.cacheManager.del(`apikey_valid:${oldKey.keyHash}`);

    await this.securityAudit.logSecurityEvent(tenantId, SecurityEvent.API_KEY_ROTATED, oldKey.id, {
      severity: 'MEDIUM',
      reason: 'API key rotation'
    });

    return newKey;
  }

  async getUsageHistory(tenantId: string, apiKeyId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const usageByEndpoint = await this.prisma.apiUsageLog.groupBy({
      by: ['endpoint', 'method', 'statusCode'],
      where: {
        tenantId,
        apiKeyId,
        timestamp: { gte: startDate },
      },
      _count: { id: true },
      _sum: { requestSize: true, responseSize: true, costUnit: true },
    });

    return usageByEndpoint;
  }
}
