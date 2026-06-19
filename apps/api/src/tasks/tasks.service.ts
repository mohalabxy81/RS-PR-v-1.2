import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, createdById: string, data: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        ...data,
        tenantId,
        createdById,
      },
    });
  }

  async findAll(tenantId: string, query: any) {
    const { status, assigneeId, priority } = query;

    const where: any = { tenantId };
    if (status) where.status = status;
    if (assigneeId) where.assigneeId = assigneeId;
    if (priority) where.priority = priority;

    return this.prisma.task.findMany({
      where,
      include: {
        assignee: { select: { id: true, firstName: true, lastName: true } },
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        _count: { select: { taskComments: true, taskAttachments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, tenantId },
      include: {
        assignee: { select: { id: true, firstName: true, lastName: true } },
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        taskComments: {
          include: { author: { select: { id: true, firstName: true, lastName: true } } },
          orderBy: { createdAt: 'desc' },
        },
        taskAttachments: true,
      },
    });

    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(tenantId: string, id: string, data: UpdateTaskDto) {
    const task = await this.prisma.task.findFirst({ where: { id, tenantId } });
    if (!task) throw new NotFoundException('Task not found');

    const updateData: any = { ...data };
    if (data.status === 'COMPLETED' && task.status !== 'COMPLETED') {
      updateData.completedAt = new Date();
    } else if (data.status !== 'COMPLETED') {
      updateData.completedAt = null;
    }

    return this.prisma.task.update({
      where: { id },
      data: updateData,
    });
  }

  async addComment(tenantId: string, taskId: string, authorId: string, content: string) {
    const task = await this.prisma.task.findFirst({ where: { id: taskId, tenantId } });
    if (!task) throw new NotFoundException('Task not found');

    return this.prisma.taskComment.create({
      data: { taskId, authorId, content },
    });
  }

  async remove(tenantId: string, id: string) {
    const task = await this.prisma.task.findFirst({ where: { id, tenantId } });
    if (!task) throw new NotFoundException('Task not found');

    return this.prisma.task.delete({ where: { id } });
  }
}
