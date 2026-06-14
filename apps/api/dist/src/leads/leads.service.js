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
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LeadsService = class LeadsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, createdById, data) {
        return this.prisma.lead.create({
            data: {
                ...data,
                tenantId,
                createdById,
                leadTags: data.tags
                    ? { create: data.tags.map((tag) => ({ tag })) }
                    : undefined,
            },
        });
    }
    async findAll(tenantId, query) {
        const { page = 1, limit = 20, status, assigneeId, isArchived = false } = query;
        const skip = (page - 1) * limit;
        const where = { tenantId, isArchived: isArchived === 'true' };
        if (status)
            where.status = status;
        if (assigneeId)
            where.assigneeId = assigneeId;
        const [data, total] = await Promise.all([
            this.prisma.lead.findMany({
                where,
                skip,
                take: Number(limit),
                include: {
                    assignee: { select: { id: true, firstName: true, lastName: true } },
                    leadTags: { select: { tag: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.lead.count({ where }),
        ]);
        return { data, meta: { total, page: Number(page), limit: Number(limit) } };
    }
    async findOne(tenantId, id) {
        const lead = await this.prisma.lead.findFirst({
            where: { id, tenantId },
            include: {
                assignee: { select: { id: true, firstName: true, lastName: true } },
                createdBy: { select: { id: true, firstName: true, lastName: true } },
                leadTags: { select: { tag: true } },
                leadNotes: {
                    include: { author: { select: { id: true, firstName: true, lastName: true } } },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        return lead;
    }
    async update(tenantId, id, data) {
        const lead = await this.prisma.lead.findFirst({ where: { id, tenantId } });
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        const updateData = { ...data };
        delete updateData.tags;
        return this.prisma.lead.update({
            where: { id },
            data: updateData,
        });
    }
    async addNote(tenantId, leadId, authorId, content) {
        const lead = await this.prisma.lead.findFirst({ where: { id: leadId, tenantId } });
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        return this.prisma.leadNote.create({
            data: { leadId, authorId, content },
        });
    }
    async assign(tenantId, id, assigneeId) {
        const lead = await this.prisma.lead.findFirst({ where: { id, tenantId } });
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        return this.prisma.lead.update({
            where: { id },
            data: { assigneeId },
        });
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeadsService);
//# sourceMappingURL=leads.service.js.map