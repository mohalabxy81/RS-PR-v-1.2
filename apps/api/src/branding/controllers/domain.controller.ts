import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DomainService } from '../services/domain.service';

@Controller('branding/domains')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @Get('brand/:brandId')
  async getDomains(@Param('brandId') brandId: string) {
    return this.domainService.getDomains(brandId);
  }

  @Post('brand/:brandId')
  async addDomain(
    @Param('brandId') brandId: string,
    @Body() body: { domain: string }
  ) {
    return this.domainService.addDomain(brandId, body.domain);
  }

  @Post(':domainId/verify')
  async verifyDomain(@Param('domainId') domainId: string) {
    return this.domainService.verifyDomain(domainId);
  }
}
