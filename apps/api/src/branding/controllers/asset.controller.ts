import { Controller, Get, Post, Param, Delete, Body } from '@nestjs/common';
import { AssetService } from '../services/asset.service';

@Controller('v1/branding/assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get('brand/:brandId')
  async getAssets(@Param('brandId') brandId: string) {
    return this.assetService.getAssets(brandId);
  }

  @Post('brand/:brandId')
  async uploadAsset(
    @Param('brandId') brandId: string,
    @Body() body: { file: any, assetType: string } // In reality use @UploadedFile() with FileInterceptor
  ) {
    return this.assetService.uploadAsset(brandId, body.file, body.assetType);
  }

  @Delete(':assetId')
  async deleteAsset(@Param('assetId') assetId: string) {
    return this.assetService.deleteAsset(assetId);
  }
}
