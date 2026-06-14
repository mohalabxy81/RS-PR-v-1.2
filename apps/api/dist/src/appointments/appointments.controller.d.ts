import { AppointmentsService } from './appointments.service';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(user: CurrentUserPayload, data: any): Promise<{
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
        dealId: string | null;
        startTime: Date;
        endTime: Date;
        location: string | null;
        reminderAt: Date | null;
        organizerId: string;
    }>;
    findAll(user: CurrentUserPayload, query: any): Promise<({
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
        dealId: string | null;
        startTime: Date;
        endTime: Date;
        location: string | null;
        reminderAt: Date | null;
        organizerId: string;
    })[]>;
    findOne(user: CurrentUserPayload, id: string): Promise<{
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
        dealId: string | null;
        startTime: Date;
        endTime: Date;
        location: string | null;
        reminderAt: Date | null;
        organizerId: string;
    }>;
    update(user: CurrentUserPayload, id: string, data: any): Promise<{
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
        dealId: string | null;
        startTime: Date;
        endTime: Date;
        location: string | null;
        reminderAt: Date | null;
        organizerId: string;
    }>;
    remove(user: CurrentUserPayload, id: string): Promise<{
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
        dealId: string | null;
        startTime: Date;
        endTime: Date;
        location: string | null;
        reminderAt: Date | null;
        organizerId: string;
    }>;
}
