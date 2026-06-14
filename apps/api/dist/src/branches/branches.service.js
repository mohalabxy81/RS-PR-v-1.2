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
exports.BranchesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BranchesService = class BranchesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, data) {
        return this.prisma.branch.create({
            data: { ...data, tenantId },
        });
    }
    async findAll(tenantId) {
        return this.prisma.branch.findMany({
            where: { tenantId },
            include: {
                _count: { select: { users: true, properties: true, leads: true } },
            },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(tenantId, id) {
        const branch = await this.prisma.branch.findFirst({
            where: { id, tenantId },
            include: {
                users: { select: { id: true, firstName: true, lastName: true, email: true } },
            },
        });
        if (!branch)
            throw new common_1.NotFoundException('Branch not found');
        return branch;
    }
    async update(tenantId, id, data) {
        const branch = await this.prisma.branch.findFirst({ where: { id, tenantId } });
        if (!branch)
            throw new common_1.NotFoundException('Branch not found');
        return this.prisma.branch.update({
            where: { id },
            data,
        });
    }
    async remove(tenantId, id) {
        const branch = await this.prisma.branch.findFirst({ where: { id, tenantId } });
        if (!branch)
            throw new common_1.NotFoundException('Branch not found');
        return this.prisma.branch.delete({ where: { id } });
    }
};
exports.BranchesService = BranchesService;
exports.BranchesService = BranchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BranchesService);
//# sourceMappingURL=branches.service.js.map