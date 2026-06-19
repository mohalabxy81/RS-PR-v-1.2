import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
export declare class TasksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, createdById: string, data: CreateTaskDto): Promise<{
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        entityId: string | null;
        entityType: string | null;
        assigneeId: string | null;
        createdById: string | null;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
        completedAt: Date | null;
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
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        entityId: string | null;
        entityType: string | null;
        assigneeId: string | null;
        createdById: string | null;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
        completedAt: Date | null;
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
            name: string;
            id: string;
            createdAt: Date;
            s3Key: string | null;
            mimeType: string | null;
            fileSize: number | null;
            taskId: string;
        }[];
    } & {
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        entityId: string | null;
        entityType: string | null;
        assigneeId: string | null;
        createdById: string | null;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
        completedAt: Date | null;
    }>;
    update(tenantId: string, id: string, data: UpdateTaskDto): Promise<{
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        entityId: string | null;
        entityType: string | null;
        assigneeId: string | null;
        createdById: string | null;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
        completedAt: Date | null;
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
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        entityId: string | null;
        entityType: string | null;
        assigneeId: string | null;
        createdById: string | null;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
        completedAt: Date | null;
    }>;
}
