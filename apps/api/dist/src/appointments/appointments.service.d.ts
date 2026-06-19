import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';
export declare class AppointmentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, organizerId: string, data: CreateAppointmentDto): Promise<{
        description: string | null;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        propertyId: string | null;
        leadId: string | null;
        customerId: string | null;
        dealId: string | null;
        organizerId: string;
        type: import("@prisma/client").$Enums.AppointmentType;
        startTime: Date;
        endTime: Date;
        location: string | null;
        reminderAt: Date | null;
    }>;
    findAll(tenantId: string, query: any): Promise<({
        property: {
            id: string;
            title: string;
        } | null;
        lead: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        customer: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        organizer: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        description: string | null;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        propertyId: string | null;
        leadId: string | null;
        customerId: string | null;
        dealId: string | null;
        organizerId: string;
        type: import("@prisma/client").$Enums.AppointmentType;
        startTime: Date;
        endTime: Date;
        location: string | null;
        reminderAt: Date | null;
    })[]>;
    findOne(tenantId: string, id: string): Promise<{
        property: {
            id: string;
            title: string;
        } | null;
        lead: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        customer: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        deal: {
            id: string;
            title: string;
        } | null;
        organizer: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        description: string | null;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        propertyId: string | null;
        leadId: string | null;
        customerId: string | null;
        dealId: string | null;
        organizerId: string;
        type: import("@prisma/client").$Enums.AppointmentType;
        startTime: Date;
        endTime: Date;
        location: string | null;
        reminderAt: Date | null;
    }>;
    update(tenantId: string, id: string, data: UpdateAppointmentDto): Promise<{
        description: string | null;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        propertyId: string | null;
        leadId: string | null;
        customerId: string | null;
        dealId: string | null;
        organizerId: string;
        type: import("@prisma/client").$Enums.AppointmentType;
        startTime: Date;
        endTime: Date;
        location: string | null;
        reminderAt: Date | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        description: string | null;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        propertyId: string | null;
        leadId: string | null;
        customerId: string | null;
        dealId: string | null;
        organizerId: string;
        type: import("@prisma/client").$Enums.AppointmentType;
        startTime: Date;
        endTime: Date;
        location: string | null;
        reminderAt: Date | null;
    }>;
}
