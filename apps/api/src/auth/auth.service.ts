import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto/auth.dto';

// TODO(security): Consider migrating password hashing from bcrypt to Argon2id (Phase 2)
// TODO(security): Add OAuth provider support (Phase 2)
// TODO(security): Add MFA support (Phase 2)
// TODO(security): Add leaked-password detection via HaveIBeenPwned API (Phase 2)

const BCRYPT_ROUNDS = 12;
const VERIFICATION_TOKEN_TTL_HOURS = 24;
const RESET_TOKEN_TTL_HOURS = 1;

// Default system roles seeded on tenant creation
const SYSTEM_ROLES = [
  { name: 'Company Owner', isSystem: true },
  { name: 'Branch Manager', isSystem: true },
  { name: 'Agent', isSystem: true },
  { name: 'Read Only', isSystem: true },
];

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ─────────────────────────────────────────────
  // REGISTER — Creates tenant + owner user + default roles
  // ─────────────────────────────────────────────
  async register(dto: RegisterDto) {
    // Check for existing tenant slug
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug: dto.companySlug },
    });
    if (existingTenant) {
      throw new ConflictException('Company slug is already taken');
    }

    // Check for existing user email
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    // Hash password — MUST NOT log plain password
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    // Create tenant + default roles + owner user in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create tenant
      const tenant = await tx.tenant.create({
        data: {
          name: dto.companyName,
          slug: dto.companySlug.toLowerCase(),
          status: 'TRIAL',
          subscriptionPlan: 'STARTER',
        },
      });

      // Seed default roles for this tenant
      const roles = await Promise.all(
        SYSTEM_ROLES.map((r) =>
          tx.role.create({
            data: {
              tenantId: tenant.id,
              name: r.name,
              isSystem: r.isSystem,
            },
          }),
        ),
      );

      const ownerRole = roles.find((r) => r.name === 'Company Owner')!;

      // Create email verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenHash = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

      // Create owner user
      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          roleId: ownerRole.id,
          email: dto.email.toLowerCase(),
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          status: 'INVITED',
          // Store hashed verification token as a temporary field approach
          // We'll use AuditLog metadata for simplicity; in production use a separate VerificationToken table
        },
      });

      // Log initial audit
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

    // TODO: Send verification email via queue (Phase 1 email service)
    this.logger.log(`New tenant registered: ${result.tenant.slug}`);

    return {
      message: 'Registration successful. Please verify your email.',
      tenantSlug: result.tenant.slug,
    };
  }

  // ─────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────
  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    // MUST NOT log the email in error paths to avoid leaking credentials in logs
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { role: true, tenant: true },
    });

    // Use constant-time comparison to prevent timing attacks
    const passwordValid =
      user && (await bcrypt.compare(dto.password, user.passwordHash));

    if (!user || !passwordValid) {
      // Generic error — never indicate whether email or password was wrong
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === 'SUSPENDED' || user.tenant.status === 'SUSPENDED') {
      throw new UnauthorizedException('Account is suspended');
    }

    if (user.tenant.status === 'CANCELLED') {
      throw new UnauthorizedException('Tenant account is not active');
    }

    // Generate token pair
    const { accessToken, refreshToken } = await this.generateTokenPair(
      user,
      ipAddress,
      userAgent,
    );

    // Update last login timestamp
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

  // ─────────────────────────────────────────────
  // LOGOUT — Revoke specific refresh token
  // ─────────────────────────────────────────────
  async logout(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);

    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  // ─────────────────────────────────────────────
  // LOGOUT ALL DEVICES — Revoke all refresh tokens for a user
  // ─────────────────────────────────────────────
  async logoutAll(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  // ─────────────────────────────────────────────
  // REFRESH TOKEN — Rotation pattern
  // ─────────────────────────────────────────────
  async refreshTokens(
    rawRefreshToken: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    let payload: { sub: string; tenantId: string };

    try {
      payload = this.jwtService.verify(rawRefreshToken, {
        secret: this.config.get('jwt.refreshSecret'),
        algorithms: ['HS256'],
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const tokenHash = this.hashToken(rawRefreshToken);
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: { include: { role: true, tenant: true } } },
    });

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      // Token reuse detected — revoke all tokens for this user (token theft prevention)
      if (storedToken?.userId) {
        await this.logoutAll(storedToken.userId);
        this.logger.warn(
          `Token reuse detected for user ${storedToken.userId} — all sessions revoked`,
        );
      }
      throw new UnauthorizedException('Refresh token invalid or expired');
    }

    const { user } = storedToken;

    // Revoke old token (rotation)
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Issue new token pair
    return this.generateTokenPair(user, ipAddress, userAgent);
  }

  // ─────────────────────────────────────────────
  // FORGOT PASSWORD
  // ─────────────────────────────────────────────
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    // Always return success — don't reveal whether email exists
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

    // Store reset token in audit log metadata (simplified for Phase 1)
    // TODO: In production use a dedicated PasswordResetToken table
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

    // TODO: Send email via queue with reset link
    this.logger.log(`Password reset requested for user ${user.id}`);

    return { message: 'If that email is registered, a reset link has been sent.' };
  }

  // ─────────────────────────────────────────────
  // RESET PASSWORD
  // ─────────────────────────────────────────────
  async resetPassword(dto: ResetPasswordDto) {
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(dto.token)
      .digest('hex');

    // Find the most recent valid reset request
    const auditEntry = await this.prisma.auditLog.findFirst({
      where: {
        action: 'password_reset_requested',
        after: { path: ['resetTokenHash'], equals: resetTokenHash },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!auditEntry || !auditEntry.after) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const tokenData = auditEntry.after as { resetTokenHash: string; expiresAt: string };
    if (new Date(tokenData.expiresAt) < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: auditEntry.userId! },
        data: { passwordHash, status: 'ACTIVE' },
      }),
      // Invalidate all sessions after password reset
      this.prisma.refreshToken.updateMany({
        where: { userId: auditEntry.userId!, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { message: 'Password reset successfully. Please login with your new password.' };
  }

  // ─────────────────────────────────────────────
  // CHANGE PASSWORD (authenticated)
  // ─────────────────────────────────────────────
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');

    const passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      }),
      // Revoke all other sessions after password change
      this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { message: 'Password changed successfully. All sessions have been revoked.' };
  }

  // ─────────────────────────────────────────────
  // GET SESSIONS — list active refresh tokens (device tracking)
  // ─────────────────────────────────────────────
  async getSessions(userId: string) {
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

  // ─────────────────────────────────────────────
  // REVOKE SESSION
  // ─────────────────────────────────────────────
  async revokeSession(userId: string, sessionId: string) {
    const token = await this.prisma.refreshToken.findFirst({
      where: { id: sessionId, userId },
    });
    if (!token) throw new NotFoundException('Session not found');

    await this.prisma.refreshToken.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });

    return { message: 'Session revoked successfully' };
  }

  // ─────────────────────────────────────────────
  // PRIVATE — Generate access + refresh token pair
  // ─────────────────────────────────────────────
  private async generateTokenPair(
    user: { id: string; email: string; tenantId: string; role?: { name: string } | null; roleId?: string | null },
    ipAddress?: string,
    userAgent?: string,
  ) {
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

    const refreshExpiresIn = this.config.get<string>('jwt.refreshExpiresIn') || '7d';
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

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private parseDeviceInfo(userAgent: string): string {
    // Simple device detection — enhance in Phase 2
    if (userAgent.includes('Mobile')) return 'Mobile Browser';
    if (userAgent.includes('Chrome')) return 'Chrome Browser';
    if (userAgent.includes('Firefox')) return 'Firefox Browser';
    if (userAgent.includes('Safari')) return 'Safari Browser';
    return 'Unknown Device';
  }
}
