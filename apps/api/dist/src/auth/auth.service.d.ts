import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SessionBlocklistService } from './session-blocklist.service';
import { SecurityAuditService } from '../audit-logs/security-audit.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly config;
    private readonly sessionBlocklist;
    private readonly securityAudit;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService, sessionBlocklist: SessionBlocklistService, securityAudit: SecurityAuditService);
    register(dto: RegisterDto): Promise<{
        message: string;
        tenantSlug: string;
    }>;
    login(dto: LoginDto, ipAddress?: string, userAgent?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            tenantId: string;
            roleName: string | undefined;
        };
    }>;
    logout(sessionId: string | undefined, refreshToken: string): Promise<void>;
    logoutAll(userId: string): Promise<void>;
    refreshTokens(rawRefreshToken: string, ipAddress?: string, userAgent?: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getSessions(userId: string): Promise<{
        id: string;
        createdAt: Date;
        expiresAt: Date;
        ipAddress: string | null;
        deviceInfo: string | null;
    }[]>;
    revokeSession(userId: string, sessionId: string): Promise<{
        message: string;
    }>;
    private generateTokenPair;
    private hashToken;
    private parseDeviceInfo;
    private validatePasswordStrength;
}
