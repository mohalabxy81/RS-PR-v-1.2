import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async getBrand(tenantId: string) {
    const brand = await this.prisma.tenantBrand.findUnique({
      where: { tenantId },
      include: {
        logos: { where: { isActive: true } },
        themes: { where: { isDefault: true } },
        colors: true,
        typography: true,
      }
    });
    
    if (!brand) {
      // If brand doesn't exist, we could return a default or throw
      // Often in SaaS we lazily create it or return a default payload
      return {
        tenantId,
        companyName: 'Default Company',
        logos: [],
        themes: [],
      };
    }
    
    return brand;
  }

  async updateBrand(tenantId: string, data: any) {
    return this.prisma.tenantBrand.upsert({
      where: { tenantId },
      update: data,
      create: { ...data, tenantId },
    });
  }
}
