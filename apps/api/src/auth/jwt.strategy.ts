import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { CurrentUserPayload } from '../common/decorators/current-user.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
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
   */
  async validate(payload: {
    sub: string;
    email: string;
    tenantId: string;
    roleId?: string;
    roleName?: string;
    iat: number;
    exp: number;
  }): Promise<CurrentUserPayload> {
    if (!payload.sub || !payload.tenantId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      tenantId: payload.tenantId,
      roleId: payload.roleId,
      roleName: payload.roleName,
    };
  }
}
