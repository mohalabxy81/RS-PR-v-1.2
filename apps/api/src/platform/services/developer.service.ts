import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDeveloperDto, CreateOrganizationDto, CreateTeamDto, CreateProjectDto } from '../dto/developer.dto';

@Injectable()
export class DeveloperService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Developer Accounts ---

  async registerDeveloper(userId: string, data: Omit<RegisterDeveloperDto, 'userId'>) {
    return this.prisma.developerAccount.create({
      data: {
        userId,
        status: 'ACTIVE',
        companyName: data.companyName,
        website: data.website,
      },
    });
  }

  async getDeveloperProfile(userId: string) {
    const dev = await this.prisma.developerAccount.findUnique({
      where: { userId },
      include: {
        organizations: true,
        projects: true,
        apiKeys: true,
      },
    });
    if (!dev) throw new NotFoundException('Developer profile not found');
    return dev;
  }

  // --- Developer Organizations ---

  async createOrganization(developerId: string, data: CreateOrganizationDto) {
    return this.prisma.developerOrganization.create({
      data: {
        name: data.name,
        ownerId: developerId,
      },
    });
  }

  async getOrganization(organizationId: string) {
    return this.prisma.developerOrganization.findUnique({
      where: { id: organizationId },
      include: { teams: true, projects: true },
    });
  }

  // --- Developer Teams ---

  async createTeam(orgId: string, data: CreateTeamDto) {
    return this.prisma.developerTeam.create({
      data: {
        organizationId: orgId,
        name: data.name,
      },
    });
  }

  // --- Developer Projects ---

  async createProject(developerId: string, data: CreateProjectDto) {
    return this.prisma.developerProject.create({
      data: {
        ...data,
        developerId,
      },
    });
  }

  async getProject(projectId: string) {
    return this.prisma.developerProject.findUnique({
      where: { id: projectId },
      include: { applications: true, webhooks: true },
    });
  }
}
