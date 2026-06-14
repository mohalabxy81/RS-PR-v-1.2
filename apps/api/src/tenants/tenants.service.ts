import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true, branches: true, properties: true, leads: true },
        },
      },
    });

    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async update(id: string, data: any) {
    // Check if slug is taken by another tenant
    if (data.slug) {
      const existing = await this.prisma.tenant.findUnique({ where: { slug: data.slug } });
      if (existing && existing.id !== id) {
        throw new ConflictException('Slug is already in use');
      }
    }

    try {
      return await this.prisma.tenant.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException('Tenant not found');
    }
  }

  async updateStatus(id: string, status: any) {
     return this.update(id, { status });
  }
}
