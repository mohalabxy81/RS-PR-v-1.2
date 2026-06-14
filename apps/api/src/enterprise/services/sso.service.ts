import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SsoService {
  constructor(private readonly prisma: PrismaService) {}

  async getProviders(organizationId: string) {
    return this.prisma.enterpriseSsoProvider.findMany({
      where: { organizationId },
    });
  }

  async configureProvider(organizationId: string, data: any) {
    return this.prisma.enterpriseSsoProvider.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async updateProvider(providerId: string, data: any) {
    return this.prisma.enterpriseSsoProvider.update({
      where: { id: providerId },
      data,
    });
  }

  async deleteProvider(providerId: string) {
    return this.prisma.enterpriseSsoProvider.delete({
      where: { id: providerId },
    });
  }
}
