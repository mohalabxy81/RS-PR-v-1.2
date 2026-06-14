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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AppointmentsService = class AppointmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, organizerId, data) {
        return this.prisma.appointment.create({
            data: {
                ...data,
                tenantId,
                organizerId,
            },
        });
    }
    async findAll(tenantId, query) {
        const { startDate, endDate, organizerId } = query;
        const where = { tenantId };
        if (organizerId)
            where.organizerId = organizerId;
        if (startDate && endDate) {
            where.startTime = { gte: new Date(startDate) };
            where.endTime = { lte: new Date(endDate) };
        }
        return this.prisma.appointment.findMany({
            where,
            include: {
                organizer: { select: { id: true, firstName: true, lastName: true } },
                lead: { select: { id: true, firstName: true, lastName: true } },
                customer: { select: { id: true, firstName: true, lastName: true } },
                property: { select: { id: true, title: true } },
            },
            orderBy: { startTime: 'asc' },
        });
    }
    async findOne(tenantId, id) {
        const appointment = await this.prisma.appointment.findFirst({
            where: { id, tenantId },
            include: {
                organizer: { select: { id: true, firstName: true, lastName: true } },
                lead: { select: { id: true, firstName: true, lastName: true } },
                customer: { select: { id: true, firstName: true, lastName: true } },
                property: { select: { id: true, title: true } },
                deal: { select: { id: true, title: true } },
            },
        });
        if (!appointment)
            throw new common_1.NotFoundException('Appointment not found');
        return appointment;
    }
    async update(tenantId, id, data) {
        const appointment = await this.prisma.appointment.findFirst({ where: { id, tenantId } });
        if (!appointment)
            throw new common_1.NotFoundException('Appointment not found');
        return this.prisma.appointment.update({
            where: { id },
            data,
        });
    }
    async remove(tenantId, id) {
        const appointment = await this.prisma.appointment.findFirst({ where: { id, tenantId } });
        if (!appointment)
            throw new common_1.NotFoundException('Appointment not found');
        return this.prisma.appointment.delete({ where: { id } });
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map