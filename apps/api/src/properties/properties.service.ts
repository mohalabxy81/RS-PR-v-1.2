import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto, UpdatePropertyDto, QueryPropertyDto } from './dto/property.dto';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: CreatePropertyDto) {
    return this.prisma.property.create({
      data: { ...data, tenantId },
    });
  }

  async findAll(tenantId: string, query: QueryPropertyDto) {
    const { page = 1, limit = 20, status, propertyType, listingType, agentId } = query;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    if (status) where.status = status;
    if (propertyType) where.propertyType = propertyType;
    if (listingType) where.listingType = listingType;
    if (agentId) where.agentId = agentId;

    const [data, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          agent: { select: { id: true, firstName: true, lastName: true } },
          images: { where: { isPrimary: true }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.property.count({ where }),
    ]);

    return { data, meta: { total, page: Number(page), limit: Number(limit) } };
  }

  async findOne(tenantId: string, id: string) {
    const property = await this.prisma.property.findFirst({
      where: { id, tenantId },
      include: {
        agent: { select: { id: true, firstName: true, lastName: true } },
        images: { orderBy: { order: 'asc' } },
        documents: true,
      },
    });

    if (!property) throw new NotFoundException('Property not found');
    return property;
  }

  async update(tenantId: string, id: string, data: UpdatePropertyDto) {
    const property = await this.prisma.property.findFirst({ where: { id, tenantId } });
    if (!property) throw new NotFoundException('Property not found');

    return this.prisma.property.update({
      where: { id },
      data,
    });
  }

  async assign(tenantId: string, id: string, agentId: string | null) {
    const property = await this.prisma.property.findFirst({ where: { id, tenantId } });
    if (!property) throw new NotFoundException('Property not found');

    return this.prisma.property.update({
      where: { id },
      data: { agentId },
    });
  }
}
