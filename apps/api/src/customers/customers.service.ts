import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.customer.create({
      data: { ...data, tenantId },
    });
  }

  async findAll(tenantId: string, query: any) {
    const { page = 1, limit = 20, assigneeId } = query;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    if (assigneeId) where.assigneeId = assigneeId;

    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          assignee: { select: { id: true, firstName: true, lastName: true } },
          _count: { select: { deals: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return { data, meta: { total, page: Number(page), limit: Number(limit) } };
  }

  async findOne(tenantId: string, id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, tenantId },
      include: {
        assignee: { select: { id: true, firstName: true, lastName: true } },
        deals: {
          select: { id: true, title: true, value: true, stage: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        },
        customerNotes: {
          include: { author: { select: { id: true, firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
        },
        customerDocs: true,
      },
    });

    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(tenantId: string, id: string, data: any) {
    const customer = await this.prisma.customer.findFirst({ where: { id, tenantId } });
    if (!customer) throw new NotFoundException('Customer not found');

    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  async addNote(tenantId: string, customerId: string, authorId: string, content: string) {
    const customer = await this.prisma.customer.findFirst({ where: { id: customerId, tenantId } });
    if (!customer) throw new NotFoundException('Customer not found');

    return this.prisma.customerNote.create({
      data: { customerId, authorId, content },
    });
  }
}
