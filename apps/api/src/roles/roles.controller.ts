import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PERMISSIONS } from './permissions.constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('roles')
@Version('1')
@Controller({ path: 'roles', version: '1' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('permissions')
  @ApiOperation({ summary: 'List all available permissions' })
  @RequirePermissions(PERMISSIONS.READ_ROLE)
  async getAllPermissions() {
    return this.rolesService.getAllPermissions();
  }

  @Get()
  @ApiOperation({ summary: 'List all roles for the current tenant' })
  @RequirePermissions(PERMISSIONS.READ_ROLE)
  async getRoles(@CurrentUser() user: CurrentUserPayload) {
    return this.rolesService.getRolesForTenant(user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific role by ID' })
  @RequirePermissions(PERMISSIONS.READ_ROLE)
  async getRoleById(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    const role = await this.rolesService.getRoleById(id, user.tenantId);
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new custom role' })
  @RequirePermissions(PERMISSIONS.CREATE_ROLE)
  async createRole(
    @CurrentUser() user: CurrentUserPayload,
    @Body('name') name: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    if (!name || !permissionIds || !Array.isArray(permissionIds)) {
      throw new BadRequestException('Invalid payload');
    }
    return this.rolesService.createRole(user.tenantId, name, permissionIds);
  }

  @Put(':id/permissions')
  @ApiOperation({ summary: 'Update permissions for a custom role' })
  @RequirePermissions(PERMISSIONS.UPDATE_ROLE)
  async updateRolePermissions(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    if (!permissionIds || !Array.isArray(permissionIds)) {
      throw new BadRequestException('Invalid payload');
    }
    const updated = await this.rolesService.updateRolePermissions(id, user.tenantId, permissionIds);
    if (!updated) throw new NotFoundException('Role not found');
    return updated;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a custom role' })
  @RequirePermissions(PERMISSIONS.DELETE_ROLE)
  async deleteRole(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    const deleted = await this.rolesService.deleteRole(id, user.tenantId);
    if (!deleted) throw new NotFoundException('Role not found or is a system role');
    return { message: 'Role deleted successfully' };
  }
}
