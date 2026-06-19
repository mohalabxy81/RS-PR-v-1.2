import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class ApiKeyService {
  private readonly logger = new Logger(ApiKeyService.name);

  constructor(private readonly prisma: PrismaService) {}

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

    // Note: We should ideally cache this in Redis to save DB queries
    const apiKeyRecord = await this.prisma.apiKey.findUnique({
      where: { keyHash },
    });

    if (!apiKeyRecord) {
      return null;
    }

    if (apiKeyRecord.status !== 'ACTIVE') {
      return null;
    }

    if (apiKeyRecord.expiresAt && apiKeyRecord.expiresAt < new Date()) {
      await this.revokeApiKey(apiKeyRecord.id); // Auto revoke
      return null;
    }

    // Update lastUsedAt asynchronously or via BullMQ in production, 
    // but for simplicity here we do it inline or defer it
    // We defer to the Usage worker to update lastUsedAt to avoid blocking requests.

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
    return this.prisma.apiKey.update({
      where: { id },
      data: { status: 'REVOKED' },
    });
  }
}
