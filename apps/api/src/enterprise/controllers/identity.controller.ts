import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SsoService } from '../services/sso.service';
import { SecurityService } from '../services/security.service';

@Controller('v1/enterprise/identity')
export class IdentityController {
  constructor(
    private readonly ssoService: SsoService,
    private readonly securityService: SecurityService
  ) {}

  // --- SSO Providers ---

  @Get(':organizationId/sso-providers')
  async getSsoProviders(@Param('organizationId') organizationId: string) {
    return this.ssoService.getProviders(organizationId);
  }

  @Post(':organizationId/sso-providers')
  async configureSsoProvider(
    @Param('organizationId') organizationId: string,
    @Body() data: any
  ) {
    return this.ssoService.configureProvider(organizationId, data);
  }

  @Put('sso-providers/:providerId')
  async updateSsoProvider(
    @Param('providerId') providerId: string,
    @Body() data: any
  ) {
    return this.ssoService.updateProvider(providerId, data);
  }

  @Delete('sso-providers/:providerId')
  async deleteSsoProvider(@Param('providerId') providerId: string) {
    return this.ssoService.deleteProvider(providerId);
  }

  // --- Administrators ---

  @Get(':organizationId/administrators')
  async getAdministrators(@Param('organizationId') organizationId: string) {
    return this.securityService.getAdministrators(organizationId);
  }

  @Post(':organizationId/administrators')
  async addAdministrator(
    @Param('organizationId') organizationId: string,
    @Body() data: any
  ) {
    return this.securityService.addAdministrator(organizationId, data);
  }

  // --- Access Reviews ---

  @Get(':organizationId/access-reviews')
  async getAccessReviews(@Param('organizationId') organizationId: string) {
    return this.securityService.getAccessReviews(organizationId);
  }

  @Post(':organizationId/access-reviews')
  async createAccessReview(
    @Param('organizationId') organizationId: string,
    @Body() data: any
  ) {
    return this.securityService.createAccessReview(organizationId, data);
  }
}
