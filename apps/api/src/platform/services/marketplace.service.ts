import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterAppDto, CreateAppVersionDto, InstallAppDto } from '../dto/marketplace.dto';
import * as crypto from 'crypto';

@Injectable()
export class MarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Apps ---

  async registerApp(projectId: string, data: any) {
    const clientId = crypto.randomBytes(16).toString('hex');
    const clientSecret = crypto.randomBytes(32).toString('hex');

    return this.prisma.platformApp.create({
      data: {
        ...data,
        projectId,
        clientId,
        clientSecret,
        status: 'DRAFT',
      },
    });
  }

  async getApp(appId: string) {
    const app = await this.prisma.platformApp.findUnique({
      where: { id: appId },
      include: { versions: true, reviews: true, installations: true },
    });
    if (!app) throw new NotFoundException('App not found');
    return app;
  }

  async getPublishedApps() {
    return this.prisma.platformApp.findMany({
      where: { status: 'PUBLISHED' },
    });
  }

  // --- App Versions ---

  async createVersion(appId: string, data: CreateAppVersionDto) {
    return this.prisma.platformAppVersion.create({
      data: {
        ...data,
        appId,
        status: 'PENDING',
      },
    });
  }

  async approveVersion(versionId: string) {
    const version = await this.prisma.platformAppVersion.update({
      where: { id: versionId },
      data: { status: 'APPROVED' },
    });
    // Publish the app if it's approved
    await this.prisma.platformApp.update({
      where: { id: version.appId },
      data: { status: 'PUBLISHED' },
    });
    return version;
  }

  // --- Installations ---

  async installApp(appId: string, tenantId: string, installedBy: string) {
    return this.prisma.platformAppInstallation.create({
      data: {
        appId,
        tenantId,
        installedBy,
        status: 'ACTIVE',
      },
    });
  }

  async getInstallations(tenantId: string) {
    return this.prisma.platformAppInstallation.findMany({
      where: { tenantId, status: 'ACTIVE' },
      include: { app: true },
    });
  }
}
