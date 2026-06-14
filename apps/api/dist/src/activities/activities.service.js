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
exports.ActivitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ActivitiesService = class ActivitiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async track(params) {
        try {
            await this.prisma.activity.create({ data: params });
        }
        catch (err) {
            console.warn('[ActivitiesService] Failed to track activity:', err);
        }
    }
    async findAll(tenantId, query) {
        const { entityType, entityId, userId, limit = 50, page = 1 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = { tenantId };
        if (entityType)
            where.entityType = entityType;
        if (entityId)
            where.entityId = entityId;
        if (userId)
            where.userId = userId;
        const [data, total] = await Promise.all([
            this.prisma.activity.findMany({
                where,
                include: {
                    user: { select: { id: true, firstName: true, lastName: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: Number(limit),
            }),
            this.prisma.activity.count({ where }),
        ]);
        return {
            data,
            meta: { total, page: Number(page), limit: Number(limit) },
        };
    }
};
exports.ActivitiesService = ActivitiesService;
exports.ActivitiesService = ActivitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ActivitiesService);
//# sourceMappingURL=activities.service.js.map