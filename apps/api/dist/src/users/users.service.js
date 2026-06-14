"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, data) {
        const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existing)
            throw new common_1.ConflictException('Email already in use');
        const password = data.password || Math.random().toString(36).slice(-8);
        const passwordHash = await bcrypt.hash(password, 12);
        return this.prisma.user.create({
            data: {
                tenantId,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                roleId: data.roleId,
                branchId: data.branchId,
                status: data.status || 'INVITED',
                passwordHash,
            },
            select: { id: true, email: true, firstName: true, lastName: true, status: true },
        });
    }
    async findAll(tenantId) {
        return this.prisma.user.findMany({
            where: { tenantId },
            select: {
                id: true, email: true, firstName: true, lastName: true, status: true,
                role: { select: { name: true } },
                branch: { select: { name: true } },
            },
            orderBy: { firstName: 'asc' },
        });
    }
    async findOne(tenantId, id) {
        const user = await this.prisma.user.findFirst({
            where: { id, tenantId },
            select: {
                id: true, email: true, firstName: true, lastName: true, status: true,
                role: { select: { id: true, name: true } },
                branch: { select: { id: true, name: true } },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async update(tenantId, id, data) {
        const user = await this.prisma.user.findFirst({ where: { id, tenantId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (data.email && data.email !== user.email) {
            const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
            if (existing)
                throw new common_1.ConflictException('Email already in use');
        }
        return this.prisma.user.update({
            where: { id },
            data,
            select: { id: true, email: true, firstName: true, lastName: true, status: true },
        });
    }
    async remove(tenantId, id) {
        const user = await this.prisma.user.findFirst({ where: { id, tenantId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.delete({ where: { id } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map