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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const BCRYPT_ROUNDS = 12;
const VERIFICATION_TOKEN_TTL_HOURS = 24;
const RESET_TOKEN_TTL_HOURS = 1;
const SYSTEM_ROLES = [
    { name: 'Company Owner', isSystem: true },
    { name: 'Branch Manager', isSystem: true },
    { name: 'Agent', isSystem: true },
    { name: 'Read Only', isSystem: true },
];
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwtService;
    config;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, jwtService, config) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
    }
    async register(dto) {
        const existingTenant = await this.prisma.tenant.findUnique({
            where: { slug: dto.companySlug },
        });
        if (existingTenant) {
            throw new common_1.ConflictException('Company slug is already taken');
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email is already registered');
        }
        const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
        const result = await this.prisma.$transaction(async (tx) => {
            const tenant = await tx.tenant.create({
                data: {
                    name: dto.companyName,
                    slug: dto.companySlug.toLowerCase(),
                    status: 'TRIAL',
                    subscriptionPlan: 'STARTER',
                },
            });
            const roles = await Promise.all(SYSTEM_ROLES.map((r) => tx.role.create({
                data: {
                    tenantId: tenant.id,
                    name: r.name,
                    isSystem: r.isSystem,
                },
            })));
            const ownerRole = roles.find((r) => r.name === 'Company Owner');
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const verificationTokenHash = crypto
                .createHash('sha256')
                .update(verificationToken)
                .digest('hex');
            const user = await tx.user.create({
                data: {
                    tenantId: tenant.id,
                    roleId: ownerRole.id,
                    email: dto.email.toLowerCase(),
                    passwordHash,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    status: 'INVITED',
                },
            });
            await tx.auditLog.create({
                data: {
                    tenantId: tenant.id,
                    userId: user.id,
                    action: 'registered',
                    entity: 'Tenant',
                    entityId: tenant.id,
                    after: { companyName: dto.companyName, email: dto.email },
                },
            });
            return { tenant, user, ownerRole, verificationToken };
        });
        this.logger.log(`New tenant registered: ${result.tenant.slug}`);
        return {
            message: 'Registration successful. Please verify your email.',
            tenantSlug: result.tenant.slug,
        };
    }
    async login(dto, ipAddress, userAgent) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
            include: { role: true, tenant: true },
        });
        const passwordValid = user && (await bcrypt.compare(dto.password, user.passwordHash));
        if (!user || !passwordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.status === 'SUSPENDED' || user.tenant.status === 'SUSPENDED') {
            throw new common_1.UnauthorizedException('Account is suspended');
        }
        if (user.tenant.status === 'CANCELLED') {
            throw new common_1.UnauthorizedException('Tenant account is not active');
        }
        const { accessToken, refreshToken } = await this.generateTokenPair(user, ipAddress, userAgent);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                tenantId: user.tenantId,
                roleName: user.role?.name,
            },
        };
    }
    async logout(refreshToken) {
        const tokenHash = this.hashToken(refreshToken);
        await this.prisma.refreshToken.updateMany({
            where: { tokenHash, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
    async logoutAll(userId) {
        await this.prisma.refreshToken.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
    async refreshTokens(rawRefreshToken, ipAddress, userAgent) {
        let payload;
        try {
            payload = this.jwtService.verify(rawRefreshToken, {
                secret: this.config.get('jwt.refreshSecret'),
                algorithms: ['HS256'],
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        const tokenHash = this.hashToken(rawRefreshToken);
        const storedToken = await this.prisma.refreshToken.findUnique({
            where: { tokenHash },
            include: { user: { include: { role: true, tenant: true } } },
        });
        if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
            if (storedToken?.userId) {
                await this.logoutAll(storedToken.userId);
                this.logger.warn(`Token reuse detected for user ${storedToken.userId} — all sessions revoked`);
            }
            throw new common_1.UnauthorizedException('Refresh token invalid or expired');
        }
        const { user } = storedToken;
        await this.prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { revokedAt: new Date() },
        });
        return this.generateTokenPair(user, ipAddress, userAgent);
    }
    async forgotPassword(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (!user) {
            return { message: 'If that email is registered, a reset link has been sent.' };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + RESET_TOKEN_TTL_HOURS);
        await this.prisma.auditLog.create({
            data: {
                tenantId: user.tenantId,
                userId: user.id,
                action: 'password_reset_requested',
                entity: 'User',
                entityId: user.id,
                after: { resetTokenHash, expiresAt: expiresAt.toISOString() },
            },
        });
        this.logger.log(`Password reset requested for user ${user.id}`);
        return { message: 'If that email is registered, a reset link has been sent.' };
    }
    async resetPassword(dto) {
        const resetTokenHash = crypto
            .createHash('sha256')
            .update(dto.token)
            .digest('hex');
        const auditEntry = await this.prisma.auditLog.findFirst({
            where: {
                action: 'password_reset_requested',
                after: { path: ['resetTokenHash'], equals: resetTokenHash },
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!auditEntry || !auditEntry.after) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        const tokenData = auditEntry.after;
        if (new Date(tokenData.expiresAt) < new Date()) {
            throw new common_1.BadRequestException('Reset token has expired');
        }
        const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: auditEntry.userId },
                data: { passwordHash, status: 'ACTIVE' },
            }),
            this.prisma.refreshToken.updateMany({
                where: { userId: auditEntry.userId, revokedAt: null },
                data: { revokedAt: new Date() },
            }),
        ]);
        return { message: 'Password reset successfully. Please login with your new password.' };
    }
    async changePassword(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException('Current password is incorrect');
        const passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: userId },
                data: { passwordHash },
            }),
            this.prisma.refreshToken.updateMany({
                where: { userId, revokedAt: null },
                data: { revokedAt: new Date() },
            }),
        ]);
        return { message: 'Password changed successfully. All sessions have been revoked.' };
    }
    async getSessions(userId) {
        const tokens = await this.prisma.refreshToken.findMany({
            where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
            select: {
                id: true,
                deviceInfo: true,
                ipAddress: true,
                createdAt: true,
                expiresAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return tokens;
    }
    async revokeSession(userId, sessionId) {
        const token = await this.prisma.refreshToken.findFirst({
            where: { id: sessionId, userId },
        });
        if (!token)
            throw new common_1.NotFoundException('Session not found');
        await this.prisma.refreshToken.update({
            where: { id: sessionId },
            data: { revokedAt: new Date() },
        });
        return { message: 'Session revoked successfully' };
    }
    async generateTokenPair(user, ipAddress, userAgent) {
        const payload = {
            sub: user.id,
            email: user.email,
            tenantId: user.tenantId,
            roleId: user.roleId,
            roleName: user.role?.name,
        };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.config.get('jwt.accessSecret'),
            expiresIn: this.config.get('jwt.accessExpiresIn'),
            algorithm: 'HS256',
        });
        const rawRefreshToken = crypto.randomBytes(64).toString('hex');
        const tokenHash = this.hashToken(rawRefreshToken);
        const refreshExpiresIn = this.config.get('jwt.refreshExpiresIn') || '7d';
        const expiresAt = new Date();
        const days = parseInt(refreshExpiresIn.replace('d', ''), 10) || 7;
        expiresAt.setDate(expiresAt.getDate() + days);
        await this.prisma.refreshToken.create({
            data: {
                tenantId: user.tenantId,
                userId: user.id,
                tokenHash,
                expiresAt,
                ipAddress,
                userAgent,
                deviceInfo: userAgent ? this.parseDeviceInfo(userAgent) : undefined,
            },
        });
        return { accessToken, refreshToken: rawRefreshToken };
    }
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    parseDeviceInfo(userAgent) {
        if (userAgent.includes('Mobile'))
            return 'Mobile Browser';
        if (userAgent.includes('Chrome'))
            return 'Chrome Browser';
        if (userAgent.includes('Firefox'))
            return 'Firefox Browser';
        if (userAgent.includes('Safari'))
            return 'Safari Browser';
        return 'Unknown Device';
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map