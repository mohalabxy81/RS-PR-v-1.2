import { CustomersService } from './customers.service';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(user: CurrentUserPayload, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        tenantId: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        address: string | null;
        notes: string | null;
        assigneeId: string | null;
        nationality: string | null;
    }>;
    findAll(user: CurrentUserPayload, query: any): Promise<{
        data: ({
            _count: {
                deals: number;
            };
            assignee: {
                id: string;
                firstName: string;
                lastName: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string | null;
            tenantId: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            address: string | null;
            notes: string | null;
            assigneeId: string | null;
            nationality: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    findOne(user: CurrentUserPayload, id: string): Promise<{
        deals: {
            id: string;
            createdAt: Date;
            title: string;
            value: number;
            stage: import("@prisma/client").$Enums.DealStage;
        }[];
        customerNotes: ({
            author: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            customerId: string;
            authorId: string;
        })[];
        assignee: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        customerDocs: {
            url: string;
            id: string;
            name: string;
            createdAt: Date;
            s3Key: string | null;
            mimeType: string | null;
            fileSize: number | null;
            docType: string;
            customerId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        tenantId: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        address: string | null;
        notes: string | null;
        assigneeId: string | null;
        nationality: string | null;
    }>;
    update(user: CurrentUserPayload, id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        tenantId: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        address: string | null;
        notes: string | null;
        assigneeId: string | null;
        nationality: string | null;
    }>;
    addNote(user: CurrentUserPayload, id: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        customerId: string;
        authorId: string;
    }>;
}
