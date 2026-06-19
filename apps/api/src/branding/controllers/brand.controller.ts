import { Version, Controller, Get, Post, Body, Param, UseGuards, Put } from '@nestjs/common';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { BrandService } from '../services/brand.service';

@Controller('branding/brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @RequirePermissions('branding.manage')
  @Get(':tenantId')
  async getBrand(@Param('tenantId') tenantId: string) {
    return this.brandService.getBrand(tenantId);
  }

  @RequirePermissions('branding.manage')
  @Put(':tenantId')
  async updateBrand(
    @Param('tenantId') tenantId: string,
    @Body() updateData: any
  ) {
    return this.brandService.updateBrand(tenantId, updateData);
  }
}
