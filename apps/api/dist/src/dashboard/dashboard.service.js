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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMetrics(tenantId, userId, roleName) {
        if (roleName === 'Agent') {
            const [leads, appointments, tasks, properties, deals] = await Promise.all([
                this.prisma.lead.count({ where: { tenantId, assigneeId: userId, isArchived: false } }),
                this.prisma.appointment.count({
                    where: { tenantId, organizerId: userId, startTime: { gte: new Date() } },
                }),
                this.prisma.task.count({ where: { tenantId, assigneeId: userId, status: { not: 'COMPLETED' } } }),
                this.prisma.property.count({ where: { tenantId, agentId: userId, status: 'AVAILABLE' } }),
                this.prisma.deal.count({ where: { tenantId, assigneeId: userId, stage: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] } } }),
            ]);
            return { type: 'agent', leads, appointments, tasks, properties, deals };
        }
        const [totalLeads, openDeals, revenueData, activeAgents, activeProperties] = await Promise.all([
            this.prisma.lead.count({ where: { tenantId, isArchived: false } }),
            this.prisma.deal.count({ where: { tenantId, stage: { notIn: ['CLOSED_WON', 'CLOSED_LOST'] } } }),
            this.prisma.deal.aggregate({
                where: { tenantId, stage: 'CLOSED_WON' },
                _sum: { value: true },
            }),
            this.prisma.user.count({ where: { tenantId, status: 'ACTIVE' } }),
            this.prisma.property.count({ where: { tenantId, status: 'AVAILABLE' } }),
        ]);
        return {
            type: roleName === 'Company Owner' ? 'owner' : 'manager',
            totalLeads,
            openDeals,
            totalRevenue: revenueData._sum.value || 0,
            activeAgents,
            activeProperties,
        };
    }
    async getRecentActivities(tenantId, limit = 10) {
        return this.prisma.activity.findMany({
            where: { tenantId },
            include: { user: { select: { firstName: true, lastName: true } } },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map