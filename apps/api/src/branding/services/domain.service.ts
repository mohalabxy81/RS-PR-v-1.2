import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DomainService {
  constructor(private prisma: PrismaService) {}

  async getDomains(brandId: string) {
    return this.prisma.brandDomain.findMany({
      where: { brandId },
      include: { dnsRecords: true },
    });
  }

  async addDomain(brandId: string, domain: string) {
    // Basic implementation
    return this.prisma.brandDomain.create({
      data: {
        brandId,
        domain,
        status: 'PENDING',
        sslStatus: 'PROVISIONING',
      },
    });
  }

  async verifyDomain(domainId: string) {
    // In reality this would check DNS records via a provider like Route53 or Cloudflare
    return this.prisma.brandDomain.update({
      where: { id: domainId },
      data: {
        status: 'VERIFIED',
        sslStatus: 'ACTIVE',
      },
    });
  }
}
