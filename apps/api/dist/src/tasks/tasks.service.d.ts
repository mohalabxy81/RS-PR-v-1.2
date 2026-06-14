import { PrismaService } from '../prisma/prisma.service';
export declare class TasksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, createdById: string, data: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        title: string;
        entityId: string | null;
        entityType: string | null;
        assigneeId: string | null;
        createdById: string | null;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        completedAt: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
    }>;
    findAll(tenantId: string, query: any): Promise<({
        _count: {
            taskComments: number;
            taskAttachments: number;
        };
        assignee: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        createdBy: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        title: string;
        entityId: string | null;
        entityType: string | null;
        assigneeId: string | null;
        createdById: string | null;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        completedAt: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
    })[]>;
    findOne(tenantId: string, id: string): Promise<{
        taskComments: ({
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
            authorId: string;
            taskId: string;
        })[];
        assignee: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        createdBy: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        taskAttachments: {
            url: string;
            id: string;
            name: string;
            createdAt: Date;
            s3Key: string | null;
            mimeType: string | null;
            fileSize: number | null;
            taskId: string;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        title: string;
        entityId: string | null;
        entityType: string | null;
        assigneeId: string | null;
        createdById: string | null;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        completedAt: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
    }>;
    update(tenantId: string, id: string, data: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        title: string;
        entityId: string | null;
        entityType: string | null;
        assigneeId: string | null;
        createdById: string | null;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        completedAt: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
    }>;
    addComment(tenantId: string, taskId: string, authorId: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: string;
        taskId: string;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        title: string;
        entityId: string | null;
        entityType: string | null;
        assigneeId: string | null;
        createdById: string | null;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        completedAt: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
    }>;
}
