import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, organizerId: string, data: any) {
    return this.prisma.appointment.create({
      data: {
        ...data,
        tenantId,
        organizerId,
      },
    });
  }

  async findAll(tenantId: string, query: any) {
    const { startDate, endDate, organizerId } = query;

    const where: any = { tenantId };
    if (organizerId) where.organizerId = organizerId;
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

  async findOne(tenantId: string, id: string) {
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

    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async update(tenantId: string, id: string, data: any) {
    const appointment = await this.prisma.appointment.findFirst({ where: { id, tenantId } });
    if (!appointment) throw new NotFoundException('Appointment not found');

    return this.prisma.appointment.update({
      where: { id },
      data,
    });
  }

  async remove(tenantId: string, id: string) {
    const appointment = await this.prisma.appointment.findFirst({ where: { id, tenantId } });
    if (!appointment) throw new NotFoundException('Appointment not found');

    return this.prisma.appointment.delete({ where: { id } });
  }
}
