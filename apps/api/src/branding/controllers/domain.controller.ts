import { Version, Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { DomainService } from '../services/domain.service';

@Controller('branding/domains')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @RequirePermissions('branding.manage')
  @Get('brand/:brandId')
  async getDomains(@Param('brandId') brandId: string) {
    return this.domainService.getDomains(brandId);
  }

  @RequirePermissions('branding.manage')
  @Post('brand/:brandId')
  async addDomain(
    @Param('brandId') brandId: string,
    @Body() body: { domain: string }
  ) {
    return this.domainService.addDomain(brandId, body.domain);
  }

  @RequirePermissions('branding.manage')
  @Post(':domainId/verify')
  async verifyDomain(@Param('domainId') domainId: string) {
    return this.domainService.verifyDomain(domainId);
  }
}
