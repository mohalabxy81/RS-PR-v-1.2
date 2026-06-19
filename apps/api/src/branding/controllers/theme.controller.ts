import { Version, Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { ThemeService } from '../services/theme.service';

@Controller('branding/themes')
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @RequirePermissions('branding.manage')
  @Get('brand/:brandId')
  async getThemes(@Param('brandId') brandId: string) {
    return this.themeService.getThemes(brandId);
  }

  @RequirePermissions('branding.manage')
  @Get('brand/:brandId/active')
  async getActiveTheme(@Param('brandId') brandId: string) {
    return this.themeService.getActiveTheme(brandId);
  }

  @RequirePermissions('branding.manage')
  @Post('brand/:brandId')
  async createTheme(
    @Param('brandId') brandId: string,
    @Body() data: any
  ) {
    return this.themeService.createTheme(brandId, data);
  }

  @RequirePermissions('branding.manage')
  @Put('brand/:brandId/colors')
  async updateColors(
    @Param('brandId') brandId: string,
    @Body() body: { themeMode: string, colors: any[] }
  ) {
    return this.themeService.updateThemeColors(brandId, body.themeMode, body.colors);
  }
}
