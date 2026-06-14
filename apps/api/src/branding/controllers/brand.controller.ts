import { Controller, Get, Post, Body, Param, UseGuards, Put } from '@nestjs/common';
import { BrandService } from '../services/brand.service';

@Controller('v1/branding/brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get(':tenantId')
  async getBrand(@Param('tenantId') tenantId: string) {
    return this.brandService.getBrand(tenantId);
  }

  @Put(':tenantId')
  async updateBrand(
    @Param('tenantId') tenantId: string,
    @Body() updateData: any
  ) {
    return this.brandService.updateBrand(tenantId, updateData);
  }
}
