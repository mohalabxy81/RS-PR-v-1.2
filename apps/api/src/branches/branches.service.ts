import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';

@Injectable()
export class BranchesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: CreateBranchDto) {
    return this.prisma.branch.create({
      data: { ...data, tenantId },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.branch.findMany({
      where: { tenantId },
      include: {
        _count: { select: { users: true, properties: true, leads: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const branch = await this.prisma.branch.findFirst({
      where: { id, tenantId },
      include: {
        users: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
    if (!branch) throw new NotFoundException('Branch not found');
    return branch;
  }

  async update(tenantId: string, id: string, data: UpdateBranchDto) {
    const branch = await this.prisma.branch.findFirst({ where: { id, tenantId } });
    if (!branch) throw new NotFoundException('Branch not found');

    return this.prisma.branch.update({
      where: { id },
      data,
    });
  }

  async remove(tenantId: string, id: string) {
    const branch = await this.prisma.branch.findFirst({ where: { id, tenantId } });
    if (!branch) throw new NotFoundException('Branch not found');

    return this.prisma.branch.delete({ where: { id } });
  }
}
