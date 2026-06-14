import type { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, RefreshTokenDto, ChangePasswordDto } from './dto/auth.dto';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        tenantSlug: string;
    }>;
    login(dto: LoginDto, req: Request): Promise<{
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
    refresh(dto: RefreshTokenDto, req: Request): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    logout(dto: RefreshTokenDto): Promise<void>;
    logoutAll(user: CurrentUserPayload): Promise<void>;
    changePassword(user: CurrentUserPayload, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getSessions(user: CurrentUserPayload): Promise<{
        id: string;
        createdAt: Date;
        deviceInfo: string | null;
        ipAddress: string | null;
        expiresAt: Date;
    }[]>;
    revokeSession(user: CurrentUserPayload, sessionId: string): Promise<{
        message: string;
    }>;
    getMe(user: CurrentUserPayload): Promise<CurrentUserPayload>;
}
