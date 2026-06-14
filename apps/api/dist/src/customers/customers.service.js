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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CustomersService = class CustomersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, data) {
        return this.prisma.customer.create({
            data: { ...data, tenantId },
        });
    }
    async findAll(tenantId, query) {
        const { page = 1, limit = 20, assigneeId } = query;
        const skip = (page - 1) * limit;
        const where = { tenantId };
        if (assigneeId)
            where.assigneeId = assigneeId;
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
    async findOne(tenantId, id) {
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
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        return customer;
    }
    async update(tenantId, id, data) {
        const customer = await this.prisma.customer.findFirst({ where: { id, tenantId } });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        return this.prisma.customer.update({
            where: { id },
            data,
        });
    }
    async addNote(tenantId, customerId, authorId, content) {
        const customer = await this.prisma.customer.findFirst({ where: { id: customerId, tenantId } });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        return this.prisma.customerNote.create({
            data: { customerId, authorId, content },
        });
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map