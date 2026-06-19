import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, AddTaskCommentDto } from './dto/task.dto';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(user: CurrentUserPayload, data: CreateTaskDto): Promise<{
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        assigneeId: string | null;
        createdById: string | null;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        completedAt: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
        entityType: string | null;
        entityId: string | null;
    }>;
    findAll(user: CurrentUserPayload, query: any): Promise<({
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
        assigneeId: string | null;
        createdById: string | null;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        completedAt: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
        entityType: string | null;
        entityId: string | null;
    })[]>;
    findOne(user: CurrentUserPayload, id: string): Promise<{
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
            authorId: string;
            content: string;
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
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        assigneeId: string | null;
        createdById: string | null;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        completedAt: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
        entityType: string | null;
        entityId: string | null;
    }>;
    update(user: CurrentUserPayload, id: string, data: UpdateTaskDto): Promise<{
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        assigneeId: string | null;
        createdById: string | null;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        completedAt: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
        entityType: string | null;
        entityId: string | null;
    }>;
    addComment(user: CurrentUserPayload, id: string, body: AddTaskCommentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        content: string;
        taskId: string;
    }>;
    remove(user: CurrentUserPayload, id: string): Promise<{
        description: string | null;
        status: import("@prisma/client").$Enums.TaskStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        assigneeId: string | null;
        createdById: string | null;
        priority: import("@prisma/client").$Enums.TaskPriority;
        dueDate: Date | null;
        completedAt: Date | null;
        isRecurring: boolean;
        recurrenceRule: string | null;
        entityType: string | null;
        entityId: string | null;
    }>;
}
