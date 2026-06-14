"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TasksService = class TasksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, createdById, data) {
        return this.prisma.task.create({
            data: {
                ...data,
                tenantId,
                createdById,
            },
        });
    }
    async findAll(tenantId, query) {
        const { status, assigneeId, priority } = query;
        const where = { tenantId };
        if (status)
            where.status = status;
        if (assigneeId)
            where.assigneeId = assigneeId;
        if (priority)
            where.priority = priority;
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
    async findOne(tenantId, id) {
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
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        return task;
    }
    async update(tenantId, id, data) {
        const task = await this.prisma.task.findFirst({ where: { id, tenantId } });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        const updateData = { ...data };
        if (data.status === 'COMPLETED' && task.status !== 'COMPLETED') {
            updateData.completedAt = new Date();
        }
        else if (data.status !== 'COMPLETED') {
            updateData.completedAt = null;
        }
        return this.prisma.task.update({
            where: { id },
            data: updateData,
        });
    }
    async addComment(tenantId, taskId, authorId, content) {
        const task = await this.prisma.task.findFirst({ where: { id: taskId, tenantId } });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        return this.prisma.taskComment.create({
            data: { taskId, authorId, content },
        });
    }
    async remove(tenantId, id) {
        const task = await this.prisma.task.findFirst({ where: { id, tenantId } });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        return this.prisma.task.delete({ where: { id } });
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map