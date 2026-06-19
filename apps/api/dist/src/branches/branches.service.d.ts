import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
export declare class BranchesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, data: CreateBranchDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
    }>;
    findAll(tenantId: string): Promise<({
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
    findOne(tenantId: string, id: string): Promise<{
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
    update(tenantId: string, id: string, data: UpdateBranchDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        phone: string | null;
        address: string | null;
        isActive: boolean;
    }>;
    remove(tenantId: string, id: string): Promise<{
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
