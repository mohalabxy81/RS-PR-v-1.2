import { BranchesService } from './branches.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class BranchesController {
    private readonly branchesService;
    constructor(branchesService: BranchesService);
    create(user: CurrentUserPayload, data: CreateBranchDto): Promise<{
        name: string;
        id: string;
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
        name: string;
        id: string;
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
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
    }>;
    update(user: CurrentUserPayload, id: string, data: UpdateBranchDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
    }>;
    remove(user: CurrentUserPayload, id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
    }>;
}
