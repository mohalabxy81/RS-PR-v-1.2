import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { PERMISSIONS_KEY } from '../../common/decorators/require-permissions.decorator';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';
import type { CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Also check for other decorators to ensure we don't block validly protected routes
    // that rely on OwnershipGuard, RolesGuard, or ScopesGuard instead of PermissionsGuard.
    const hasRoles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()]);
    const hasScopes = this.reflector.getAllAndOverride<string[]>('scopes', [context.getHandler(), context.getClass()]);
    const hasOwnership = this.reflector.getAllAndOverride<any>('ownership', [context.getHandler(), context.getClass()]);

    // FAIL CLOSED: If NO security metadata exists, DENY ACCESS.
    if (
      (!requiredPermissions || requiredPermissions.length === 0) &&
      (!hasRoles || hasRoles.length === 0) &&
      (!hasScopes || hasScopes.length === 0) &&
      !hasOwnership
    ) {
      throw new ForbiddenException('Missing security metadata. Endpoint is locked by default.');
    }

    // If permissions are required, validate them.
    if (requiredPermissions && requiredPermissions.length > 0) {
      const request = context.switchToHttp().getRequest();
      const user: CurrentUserPayload = request.user;

      if (!user?.roleId) {
        throw new ForbiddenException('No role assigned');
      }

      // Fetch user permissions from DB — never trust client-side data
      const rolePermissions = await this.prisma.rolePermission.findMany({
        where: { roleId: user.roleId },
        include: { permission: true },
      });

      const userPermissions = new Set(rolePermissions.map((rp) => rp.permission.action));

      // User must possess ALL required permissions to access this route
      const hasAll = requiredPermissions.every((p) => userPermissions.has(p));

      if (!hasAll) {
        throw new ForbiddenException('Insufficient permissions');
      }
    }

    return true;
  }
}
