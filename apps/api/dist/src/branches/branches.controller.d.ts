import { BranchesService } from './branches.service';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class BranchesController {
    private readonly branchesService;
    constructor(branchesService: BranchesService);
    create(user: CurrentUserPayload, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
    }>;
    findAll(user: CurrentUserPayload): Promise<({
        _count: {
            users: number;
            properties: number;
            leads: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
    })[]>;
    findOne(user: CurrentUserPayload, id: string): Promise<{
        users: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
    }>;
    update(user: CurrentUserPayload, id: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
    }>;
    remove(user: CurrentUserPayload, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
    }>;
}
