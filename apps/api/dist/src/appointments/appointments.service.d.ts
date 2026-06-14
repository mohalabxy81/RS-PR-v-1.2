import { PrismaService } from '../prisma/prisma.service';
export declare class AppointmentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, organizerId: string, data: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        title: string;
        propertyId: string | null;
        type: import("@prisma/client").$Enums.AppointmentType;
        leadId: string | null;
        customerId: string | null;
        organizerId: string;
        dealId: string | null;
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
        id: string;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        title: string;
        propertyId: string | null;
        type: import("@prisma/client").$Enums.AppointmentType;
        leadId: string | null;
        customerId: string | null;
        organizerId: string;
        dealId: string | null;
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
        id: string;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        title: string;
        propertyId: string | null;
        type: import("@prisma/client").$Enums.AppointmentType;
        leadId: string | null;
        customerId: string | null;
        organizerId: string;
        dealId: string | null;
        startTime: Date;
        endTime: Date;
        location: string | null;
        reminderAt: Date | null;
    }>;
    update(tenantId: string, id: string, data: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        title: string;
        propertyId: string | null;
        type: import("@prisma/client").$Enums.AppointmentType;
        leadId: string | null;
        customerId: string | null;
        organizerId: string;
        dealId: string | null;
        startTime: Date;
        endTime: Date;
        location: string | null;
        reminderAt: Date | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        title: string;
        propertyId: string | null;
        type: import("@prisma/client").$Enums.AppointmentType;
        leadId: string | null;
        customerId: string | null;
        organizerId: string;
        dealId: string | null;
        startTime: Date;
        endTime: Date;
        location: string | null;
        reminderAt: Date | null;
    }>;
}
