import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto, QueryCustomerDto, AddCustomerNoteDto } from './dto/customer.dto';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(user: CurrentUserPayload, data: CreateCustomerDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        address: string | null;
        phone: string | null;
        email: string | null;
        firstName: string;
        lastName: string;
        assigneeId: string | null;
        notes: string | null;
        nationality: string | null;
    }>;
    findAll(user: CurrentUserPayload, query: QueryCustomerDto): Promise<{
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
            tenantId: string;
            address: string | null;
            phone: string | null;
            email: string | null;
            firstName: string;
            lastName: string;
            assigneeId: string | null;
            notes: string | null;
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
            authorId: string;
            content: string;
            customerId: string;
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
        tenantId: string;
        address: string | null;
        phone: string | null;
        email: string | null;
        firstName: string;
        lastName: string;
        assigneeId: string | null;
        notes: string | null;
        nationality: string | null;
    }>;
    update(user: CurrentUserPayload, id: string, data: UpdateCustomerDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        address: string | null;
        phone: string | null;
        email: string | null;
        firstName: string;
        lastName: string;
        assigneeId: string | null;
        notes: string | null;
        nationality: string | null;
    }>;
    addNote(user: CurrentUserPayload, id: string, body: AddCustomerNoteDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        content: string;
        customerId: string;
    }>;
}
