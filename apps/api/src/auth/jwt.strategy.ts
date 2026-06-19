import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { SessionBlocklistService } from './session-blocklist.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly sessionBlocklist: SessionBlocklistService,
  ) {
    const secret = configService.get<string>('jwt.accessSecret');

    if (!secret) {
      throw new Error('JWT access secret is not configured');
    }

    super({
      // Extract JWT from Authorization: Bearer header ONLY
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Hardcode expected algorithm — NEVER derive from unverified token
      algorithms: ['HS256'],
      secretOrKey: secret,
    });
  }

  /**
   * Called after JWT signature is verified.
   * Return value is attached to request.user.
   *
   * Security checks performed here:
   * 1. Payload structural validity
   * 2. Session-level revocation check (Redis blocklist)
   * 3. User-level block check (logout-all / password change)
   */
  async validate(payload: {
    sub: string;
    tenantId: string;
    role: string;
    permissions: string[];
    sessionId?: string;
    iat: number;
    exp: number;
  }): Promise<CurrentUserPayload> {
    if (!payload.sub || !payload.tenantId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Check session-level blocklist (logout of specific session)
    if (payload.sessionId) {
      const blocked = await this.sessionBlocklist.isBlocked(payload.sessionId);
      if (blocked) {
        throw new UnauthorizedException('Session has been revoked');
      }
    }

    // Check user-level block (logout-all / password change / suspension)
    const userBlocked = await this.sessionBlocklist.isUserBlocked(payload.sub);
    if (userBlocked) {
      throw new UnauthorizedException('All sessions have been revoked');
    }

    return {
      userId: payload.sub,
      tenantId: payload.tenantId,
      role: payload.role,
      permissions: payload.permissions,
      sessionId: payload.sessionId,
    };
  }
}
