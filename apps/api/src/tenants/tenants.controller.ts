import { Version, Controller, Get, Param, UseGuards, Put, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../roles/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PERMISSIONS } from '../roles/permissions.constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateTenantSettingsDto } from './dto/tenant.dto';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('tenants')
@Controller({ path: 'tenants', version: '1' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current tenant details' })
  async getMyTenant(@CurrentUser() user: CurrentUserPayload) {
    return this.tenantsService.findOne(user.tenantId);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current tenant settings' })
  @ApiBody({ type: UpdateTenantSettingsDto })
  @RequirePermissions(PERMISSIONS.MANAGE_SETTINGS)
  async updateMyTenant(@CurrentUser() user: CurrentUserPayload, @Body() data: UpdateTenantSettingsDto) {
    // Only allow safe updates by standard users
    const safeData = {
      name: data.name,
      logoUrl: data.logoUrl,
    };
    return this.tenantsService.update(user.tenantId, safeData);
  }

  // Super-Admin endpoints (in a real app, these would be protected by a SuperAdmin guard)
  @Get()
  @ApiOperation({ summary: '(Super Admin) List all tenants' })
  async getAllTenants() {
    return this.tenantsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '(Super Admin) Get tenant by ID' })
  async getTenantById(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }
}
