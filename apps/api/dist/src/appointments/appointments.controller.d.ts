import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(user: CurrentUserPayload, data: CreateAppointmentDto): Promise<{
        description: string | null;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        type: import("@prisma/client").$Enums.AppointmentType;
        title: string;
        propertyId: string | null;
        leadId: string | null;
        customerId: string | null;
        organizerId: string;
        dealId: string | null;
        startTime: Date;
        endTime: Date;
        location: string | null;
        reminderAt: Date | null;
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
        description: string | null;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        type: import("@prisma/client").$Enums.AppointmentType;
        title: string;
        propertyId: string | null;
        leadId: string | null;
        customerId: string | null;
        organizerId: string;
        dealId: string | null;
        startTime: Date;
        endTime: Date;
        location: string | null;
        reminderAt: Date | null;
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
        description: string | null;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        type: import("@prisma/client").$Enums.AppointmentType;
        title: string;
        propertyId: string | null;
        leadId: string | null;
        customerId: string | null;
        organizerId: string;
        dealId: string | null;
        startTime: Date;
        endTime: Date;
        location: string | null;
        reminderAt: Date | null;
    }>;
    update(user: CurrentUserPayload, id: string, data: UpdateAppointmentDto): Promise<{
        description: string | null;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        type: import("@prisma/client").$Enums.AppointmentType;
        title: string;
        propertyId: string | null;
        leadId: string | null;
        customerId: string | null;
        organizerId: string;
        dealId: string | null;
        startTime: Date;
        endTime: Date;
        location: string | null;
        reminderAt: Date | null;
    }>;
    remove(user: CurrentUserPayload, id: string): Promise<{
        description: string | null;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        type: import("@prisma/client").$Enums.AppointmentType;
        title: string;
        propertyId: string | null;
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
