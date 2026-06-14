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
exports.DealsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DealsService = class DealsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, data) {
        return this.prisma.deal.create({
            data: { ...data, tenantId },
        });
    }
    async findAll(tenantId, query) {
        const { stage, assigneeId } = query;
        const where = { tenantId };
        if (stage)
            where.stage = stage;
        if (assigneeId)
            where.assigneeId = assigneeId;
        return this.prisma.deal.findMany({
            where,
            include: {
                customer: { select: { id: true, firstName: true, lastName: true } },
                assignee: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(tenantId, id) {
        const deal = await this.prisma.deal.findFirst({
            where: { id, tenantId },
            include: {
                customer: { select: { id: true, firstName: true, lastName: true } },
                assignee: { select: { id: true, firstName: true, lastName: true } },
                property: { select: { id: true, title: true } },
                dealNotes: {
                    include: { author: { select: { id: true, firstName: true, lastName: true } } },
                    orderBy: { createdAt: 'desc' },
                },
                stageHistory: { orderBy: { changedAt: 'desc' } },
            },
        });
        if (!deal)
            throw new common_1.NotFoundException('Deal not found');
        return deal;
    }
    async updateStage(tenantId, id, userId, stage) {
        const deal = await this.prisma.deal.findFirst({ where: { id, tenantId } });
        if (!deal)
            throw new common_1.NotFoundException('Deal not found');
        if (deal.stage === stage)
            return deal;
        return this.prisma.$transaction(async (tx) => {
            await tx.dealStageHistory.create({
                data: {
                    dealId: id,
                    fromStage: deal.stage,
                    toStage: stage,
                    changedBy: userId,
                },
            });
            return tx.deal.update({
                where: { id },
                data: { stage },
            });
        });
    }
    async update(tenantId, id, data) {
        const deal = await this.prisma.deal.findFirst({ where: { id, tenantId } });
        if (!deal)
            throw new common_1.NotFoundException('Deal not found');
        return this.prisma.deal.update({
            where: { id },
            data,
        });
    }
    async addNote(tenantId, dealId, authorId, content) {
        const deal = await this.prisma.deal.findFirst({ where: { id: dealId, tenantId } });
        if (!deal)
            throw new common_1.NotFoundException('Deal not found');
        return this.prisma.dealNote.create({
            data: { dealId, authorId, content },
        });
    }
};
exports.DealsService = DealsService;
exports.DealsService = DealsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DealsService);
//# sourceMappingURL=deals.service.js.map