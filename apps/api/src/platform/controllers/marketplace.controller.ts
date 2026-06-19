import { Version, Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { MarketplaceService } from '../services/marketplace.service';
import { RegisterAppDto, CreateAppVersionDto, InstallAppDto } from '../dto/marketplace.dto';

@ApiTags('platform-marketplace')
@ApiBearerAuth('access-token')
@Controller({ path: 'platform/marketplace', version: '1' })
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  // --- Public App Directory ---

  @RequirePermissions('platform.manage')
  @Get('apps')
  @ApiOperation({ summary: 'Browse published marketplace apps' })
  @ApiResponse({ status: 200, description: 'List of published apps returned' })
  async getPublishedApps() {
    return this.marketplaceService.getPublishedApps();
  }

  @RequirePermissions('platform.manage')
  @Get('apps/:appId')
  @ApiOperation({ summary: 'Get app details by ID' })
  @ApiResponse({ status: 200, description: 'App details returned' })
  @ApiResponse({ status: 404, description: 'App not found' })
  async getApp(@Param('appId') appId: string) {
    return this.marketplaceService.getApp(appId);
  }

  // --- Developer App Management ---

  @RequirePermissions('platform.manage')
  @Post('projects/:projectId/apps')
  @ApiOperation({ summary: 'Register a new app for a developer project' })
  @ApiResponse({ status: 201, description: 'App registered (DRAFT)' })
  @ApiBody({ type: RegisterAppDto })
  async registerApp(
    @Param('projectId') projectId: string,
    @Body() data: RegisterAppDto
  ) {
    return this.marketplaceService.registerApp(projectId, data);
  }

  @RequirePermissions('platform.manage')
  @Post('apps/:appId/versions')
  @ApiOperation({ summary: 'Submit a new version of an app for review' })
  @ApiResponse({ status: 201, description: 'Version submitted for review' })
  @ApiBody({ type: CreateAppVersionDto })
  async createVersion(
    @Param('appId') appId: string,
    @Body() data: CreateAppVersionDto
  ) {
    return this.marketplaceService.createVersion(appId, data);
  }

  // --- Admin Endpoints (requires advanced RBAC) ---

  @RequirePermissions('platform.manage')
  @Put('versions/:versionId/approve')
  @ApiOperation({ summary: 'Approve an app version (admin only)' })
  @ApiResponse({ status: 200, description: 'Version approved and app published' })
  async approveVersion(@Param('versionId') versionId: string) {
    return this.marketplaceService.approveVersion(versionId);
  }

  // --- Tenant Installations ---

  @RequirePermissions('platform.manage')
  @Post('apps/:appId/install')
  @ApiOperation({ summary: 'Install a marketplace app for a tenant' })
  @ApiResponse({ status: 201, description: 'App installed successfully' })
  @ApiBody({ type: InstallAppDto })
  async installApp(
    @Param('appId') appId: string,
    @Body() body: InstallAppDto
  ) {
    return this.marketplaceService.installApp(appId, body.tenantId, body.installedBy);
  }

  @RequirePermissions('platform.manage')
  @Get('tenants/:tenantId/installations')
  @ApiOperation({ summary: 'List all installed apps for a tenant' })
  @ApiResponse({ status: 200, description: 'List of tenant app installations' })
  async getInstallations(@Param('tenantId') tenantId: string) {
    return this.marketplaceService.getInstallations(tenantId);
  }
}
