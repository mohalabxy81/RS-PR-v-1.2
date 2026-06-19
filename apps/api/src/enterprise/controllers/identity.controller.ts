import { CreateAdministratorDto, CreateAccessReviewDto, CreateSsoProviderDto, UpdateSsoProviderDto } from '../dto/enterprise.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Version, Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SsoService } from '../services/sso.service';
import { SecurityService } from '../services/security.service';

@ApiTags('Enterprise / Identity')
@Controller('enterprise/identity')
export class IdentityController {
  constructor(
    private readonly ssoService: SsoService,
    private readonly securityService: SecurityService
  ) {}

  // --- SSO Providers ---

  @RequirePermissions('enterprise.manage')
  @Get(':organizationId/sso-providers')
  async getSsoProviders(@Param('organizationId') organizationId: string) {
    return this.ssoService.getProviders(organizationId);
  }

  @RequirePermissions('enterprise.manage')
  @Post(':organizationId/sso-providers')
  async configureSsoProvider(
    @Param('organizationId') organizationId: string,
    @Body() data: CreateSsoProviderDto
  ) {
    return this.ssoService.configureProvider(organizationId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Put('sso-providers/:providerId')
  async updateSsoProvider(
    @Param('providerId') providerId: string,
    @Body() data: UpdateSsoProviderDto
  ) {
    return this.ssoService.updateProvider(providerId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Delete('sso-providers/:providerId')
  async deleteSsoProvider(@Param('providerId') providerId: string) {
    return this.ssoService.deleteProvider(providerId);
  }

  // --- Administrators ---

  @RequirePermissions('enterprise.manage')
  @Get(':organizationId/administrators')
  async getAdministrators(@Param('organizationId') organizationId: string) {
    return this.securityService.getAdministrators(organizationId);
  }

  @RequirePermissions('enterprise.manage')
  @Post(':organizationId/administrators')
  async addAdministrator(
    @Param('organizationId') organizationId: string,
    @Body() data: CreateAdministratorDto
  ) {
    return this.securityService.addAdministrator(organizationId, data);
  }

  // --- Access Reviews ---

  @RequirePermissions('enterprise.manage')
  @Get(':organizationId/access-reviews')
  async getAccessReviews(@Param('organizationId') organizationId: string) {
    return this.securityService.getAccessReviews(organizationId);
  }

  @RequirePermissions('enterprise.manage')
  @Post(':organizationId/access-reviews')
  async createAccessReview(
    @Param('organizationId') organizationId: string,
    @Body() data: CreateAccessReviewDto
  ) {
    return this.securityService.createAccessReview(organizationId, data);
  }
}
