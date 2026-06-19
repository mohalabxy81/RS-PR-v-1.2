import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { OWNERSHIP_KEY, OwnershipMetadata } from '../decorators/enforce-ownership.decorator';
import type { CurrentUserPayload } from '../decorators/current-user.decorator';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ownershipMetadata = this.reflector.getAllAndOverride<OwnershipMetadata>(
      OWNERSHIP_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If route is not decorated for ownership validation, let PermissionsGuard handle it.
    if (!ownershipMetadata) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: CurrentUserPayload = request.user;
    const resourceId = request.params[ownershipMetadata.resourceParamKey];

    if (!user || !user.userId || !user.tenantId) {
      throw new ForbiddenException('User identity or tenant is missing');
    }

    if (!resourceId) {
      throw new ForbiddenException(`Missing resource identifier: ${ownershipMetadata.resourceParamKey}`);
    }

    // Bypass ownership checks for System Admins or Tenant Admins, if desired
    // (This aligns with traditional CRM mechanics where admins can edit anything in their tenant)
    // Here we will implement strict checking. The PermissionsGuard should handle admin overrides if needed,
    // but for true Zero Trust, we check the database.

    let resource: any = null;

    switch (ownershipMetadata.resourceType) {
      case 'Lead':
        resource = await this.prisma.lead.findFirst({ where: { id: resourceId, tenantId: user.tenantId } });
        break;
      case 'Deal':
        resource = await this.prisma.deal.findFirst({ where: { id: resourceId, tenantId: user.tenantId } });
        break;
      case 'Property':
        resource = await this.prisma.property.findFirst({ where: { id: resourceId, tenantId: user.tenantId } });
        break;
      case 'Customer':
        resource = await this.prisma.customer.findFirst({ where: { id: resourceId, tenantId: user.tenantId } });
        break;
      case 'Task':
        resource = await this.prisma.task.findFirst({ where: { id: resourceId, tenantId: user.tenantId } });
        break;
      case 'Appointment':
        resource = await this.prisma.appointment.findFirst({ where: { id: resourceId, tenantId: user.tenantId } });
        break;
      default:
        throw new ForbiddenException('Unsupported resource type for ownership validation');
    }

    if (!resource) {
      throw new NotFoundException(`${ownershipMetadata.resourceType} not found`);
    }

    // 2. Ownership check
    // We assume if you are the assignee, or organizer, you own it.
    // Different models have different foreign keys for ownership.
    let isOwner = false;

    if (ownershipMetadata.resourceType === 'Appointment') {
      isOwner = resource.organizerId === user.userId;
    } else if (ownershipMetadata.resourceType === 'Property') {
      isOwner = resource.agentId === user.userId;
    } else {
      isOwner = resource.assigneeId === user.userId; // Lead, Deal, Customer, Task
    }

    if (!isOwner) {
      // NOTE: In a real-world scenario, you might inject a RoleService here
      // to check if the user has a "SuperAdmin" or "TenantAdmin" role that bypasses this.
      // But adhering strictly to Zero Trust, explicit permission is required.
      throw new ForbiddenException(`You do not own this ${ownershipMetadata.resourceType}`);
    }

    return true;
  }
}
