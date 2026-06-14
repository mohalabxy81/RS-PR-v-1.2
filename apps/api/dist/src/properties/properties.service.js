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
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PropertiesService = class PropertiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, data) {
        return this.prisma.property.create({
            data: { ...data, tenantId },
        });
    }
    async findAll(tenantId, query) {
        const { page = 1, limit = 20, status, propertyType, listingType, agentId } = query;
        const skip = (page - 1) * limit;
        const where = { tenantId };
        if (status)
            where.status = status;
        if (propertyType)
            where.propertyType = propertyType;
        if (listingType)
            where.listingType = listingType;
        if (agentId)
            where.agentId = agentId;
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
    async findOne(tenantId, id) {
        const property = await this.prisma.property.findFirst({
            where: { id, tenantId },
            include: {
                agent: { select: { id: true, firstName: true, lastName: true } },
                images: { orderBy: { order: 'asc' } },
                documents: true,
            },
        });
        if (!property)
            throw new common_1.NotFoundException('Property not found');
        return property;
    }
    async update(tenantId, id, data) {
        const property = await this.prisma.property.findFirst({ where: { id, tenantId } });
        if (!property)
            throw new common_1.NotFoundException('Property not found');
        return this.prisma.property.update({
            where: { id },
            data,
        });
    }
    async assign(tenantId, id, agentId) {
        const property = await this.prisma.property.findFirst({ where: { id, tenantId } });
        if (!property)
            throw new common_1.NotFoundException('Property not found');
        return this.prisma.property.update({
            where: { id },
            data: { agentId },
        });
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map