import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CommunicationTemplatesService {
  constructor(private prisma: PrismaService) {}

  async list(tenantId: string, filters: { status?: string; category?: string; page?: number; limit?: number }) {
    const { status, category, page = 1, limit = 25 } = filters;
    const skip = (page - 1) * limit;
    const where: any = { tenantId };
    if (status) where.status = status;
    if (category) where.category = category;

    const [templates, total] = await Promise.all([
      this.prisma.messageTemplate.findMany({
        where,
        include: { versions: { orderBy: { version: 'desc' }, take: 1 } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.messageTemplate.count({ where }),
    ]);

    return { templates, total, page, limit };
  }

  async findOne(tenantId: string, id: string) {
    const template = await this.prisma.messageTemplate.findFirst({
      where: { id, tenantId },
      include: { versions: { orderBy: { version: 'asc' } } },
    });
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }

  async create(tenantId: string, data: {
    providerAccountId: string;
    name: string;
    category: string;
    language?: string;
    components: any[];
  }) {
    return this.prisma.messageTemplate.create({
      data: {
        tenantId,
        providerAccountId: data.providerAccountId,
        name: data.name,
        category: data.category,
        language: data.language ?? 'en_US',
        status: 'DRAFT',
        versions: {
          create: {
            version: 1,
            components: data.components,
            isApproved: false,
          },
        },
      },
      include: { versions: true },
    });
  }

  async addVersion(tenantId: string, templateId: string, components: any[]) {
    const template = await this.findOne(tenantId, templateId);
    const latestVersion = template.versions.reduce((max, v) => Math.max(max, v.version), 0);
    return this.prisma.templateVersion.create({
      data: {
        templateId,
        version: latestVersion + 1,
        components,
      },
    });
  }

  async updateStatus(tenantId: string, id: string, status: string) {
    await this.findOne(tenantId, id);
    return this.prisma.messageTemplate.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async delete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    return this.prisma.messageTemplate.delete({ where: { id } });
  }
}
