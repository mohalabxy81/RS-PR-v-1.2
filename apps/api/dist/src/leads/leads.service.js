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
const activities_service_1 = require("../activities/activities.service");
let LeadsService = class LeadsService {
    prisma;
    activities;
    constructor(prisma, activities) {
        this.prisma = prisma;
        this.activities = activities;
    }
    async create(tenantId, createdById, dto) {
        const { tags, ...data } = dto;
        const lead = await this.prisma.lead.create({
            data: {
                ...data,
                tenantId,
                createdById,
                leadTags: tags ? { create: tags.map((tag) => ({ tag })) } : undefined,
            },
        });
        await this.activities.track({
            tenantId,
            userId: createdById,
            entityType: 'Lead',
            entityId: lead.id,
            action: 'created',
            description: `Lead ${lead.firstName} ${lead.lastName} was created`,
        });
        return lead;
    }
    async findAll(tenantId, query) {
        const { page = 1, limit = 20, status, assigneeId, isArchived, search, source } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = { tenantId, isArchived: isArchived === 'true' };
        if (status)
            where.status = status;
        if (assigneeId)
            where.assigneeId = assigneeId;
        if (source)
            where.source = source;
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }
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
        return { data, meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } };
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
                deals: { select: { id: true, title: true, value: true, stage: true } },
                appointments: {
                    select: { id: true, title: true, type: true, startTime: true, status: true },
                    orderBy: { startTime: 'desc' },
                    take: 5,
                },
            },
        });
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        return lead;
    }
    async update(tenantId, id, dto, updatedById) {
        const lead = await this.prisma.lead.findFirst({ where: { id, tenantId } });
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        const updated = await this.prisma.lead.update({
            where: { id },
            data: dto,
        });
        if (dto.status && dto.status !== lead.status) {
            await this.activities.track({
                tenantId,
                userId: updatedById,
                entityType: 'Lead',
                entityId: id,
                action: 'status_changed',
                description: `Lead status changed from ${lead.status} to ${dto.status}`,
                metadata: { from: lead.status, to: dto.status },
            });
        }
        else if (updatedById) {
            await this.activities.track({
                tenantId,
                userId: updatedById,
                entityType: 'Lead',
                entityId: id,
                action: 'updated',
                description: `Lead ${lead.firstName} ${lead.lastName} was updated`,
            });
        }
        return updated;
    }
    async archive(tenantId, id) {
        const lead = await this.prisma.lead.findFirst({ where: { id, tenantId } });
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        return this.prisma.lead.update({
            where: { id },
            data: { isArchived: true, status: 'ARCHIVED' },
        });
    }
    async addNote(tenantId, leadId, authorId, content) {
        const lead = await this.prisma.lead.findFirst({ where: { id: leadId, tenantId } });
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        const note = await this.prisma.leadNote.create({
            data: { leadId, authorId, content },
            include: { author: { select: { id: true, firstName: true, lastName: true } } },
        });
        await this.activities.track({
            tenantId,
            userId: authorId,
            entityType: 'Lead',
            entityId: leadId,
            action: 'note_added',
            description: 'A note was added to the lead',
        });
        return note;
    }
    async assign(tenantId, id, assigneeId, assignedById) {
        const lead = await this.prisma.lead.findFirst({ where: { id, tenantId } });
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        const updated = await this.prisma.lead.update({
            where: { id },
            data: { assigneeId },
        });
        await this.activities.track({
            tenantId,
            userId: assignedById,
            entityType: 'Lead',
            entityId: id,
            action: 'assigned',
            description: assigneeId ? `Lead was assigned to agent ${assigneeId}` : 'Lead was unassigned',
            metadata: { assigneeId },
        });
        return updated;
    }
    async getTimeline(tenantId, leadId) {
        const lead = await this.prisma.lead.findFirst({ where: { id: leadId, tenantId } });
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        return this.prisma.activity.findMany({
            where: { tenantId, entityType: 'Lead', entityId: leadId },
            include: { user: { select: { id: true, firstName: true, lastName: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        activities_service_1.ActivitiesService])
], LeadsService);
//# sourceMappingURL=leads.service.js.map