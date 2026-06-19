import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomBytes } from 'crypto';
import { RegisterOAuthClientDto, CreateApiProductDto, CreateApiPlanDto } from '../dto/api-gateway.dto';

@Injectable()
export class ApiGatewayService {
  constructor(private readonly prisma: PrismaService) {}

  // --- API Keys ---

  async generateApiKey(developerId: string, name: string, scopes: string[]) {
    // Basic API Key generation logic
    const key = randomBytes(32).toString('hex');
    return this.prisma.developerApiKey.create({
      data: {
        developerId,
        key,
        name,
        scopes,
      },
    });
  }

  async validateApiKey(key: string) {
    const apiKey = await this.prisma.developerApiKey.findUnique({
      where: { key },
      include: { developer: true },
    });
    
    if (!apiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      throw new UnauthorizedException('API Key has expired');
    }

    // Update last used asynchronously (fire and forget pattern could be used in production)
    await this.prisma.developerApiKey.update({
      where: { key },
      data: { lastUsedAt: new Date() },
    });

    return apiKey;
  }

  // --- OAuth Clients ---

  async registerOAuthClient(developerId: string, data: RegisterOAuthClientDto) {
    const clientId = `client_${randomBytes(12).toString('hex')}`;
    const clientSecret = `secret_${randomBytes(24).toString('hex')}`;

    return this.prisma.developerOAuthClient.create({
      data: {
        name: data.appName,
        redirectUris: data.redirectUris,
        developerId,
        clientId,
        clientSecret,
      },
    });
  }

  // --- API Products & Plans ---

  async createApiProduct(data: CreateApiProductDto) {
    return this.prisma.apiProduct.create({
      data: {
        name: data.name,
        description: data.description,
        status: 'ACTIVE',
      },
    });
  }

  async createApiPlan(productId: string, data: CreateApiPlanDto) {
    return this.prisma.apiPlan.create({
      data: {
        name: data.name,
        type: 'FREE',
        price: 0,
        productId,
      },
    });
  }

  async getApiProducts() {
    return this.prisma.apiProduct.findMany({
      where: { status: 'ACTIVE' },
      include: { plans: true },
    });
  }

  // --- Subscriptions ---

  async subscribeToPlan(developerId: string, planId: string) {
    return this.prisma.apiSubscription.create({
      data: {
        developerId,
        planId,
        status: 'ACTIVE',
      },
    });
  }

  async getSubscriptions(developerId: string) {
    return this.prisma.apiSubscription.findMany({
      where: { developerId },
      include: { plan: { include: { product: true } } },
    });
  }
}
