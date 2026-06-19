import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
export declare class BranchesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, data: CreateBranchDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        address: string | null;
        phone: string | null;
        isActive: boolean;
    }>;
    findAll(tenantId: string): Promise<({
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
        address: string | null;
        phone: string | null;
        isActive: boolean;
    })[]>;
    findOne(tenantId: string, id: string): Promise<{
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
        address: string | null;
        phone: string | null;
        isActive: boolean;
    }>;
    update(tenantId: string, id: string, data: UpdateBranchDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        address: string | null;
        phone: string | null;
        isActive: boolean;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        address: string | null;
        phone: string | null;
        isActive: boolean;
    }>;
}
