import { Version, Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ThemeService } from '../services/theme.service';

@Version('1')
@Controller('branding/themes')
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @Get('brand/:brandId')
  async getThemes(@Param('brandId') brandId: string) {
    return this.themeService.getThemes(brandId);
  }

  @Get('brand/:brandId/active')
  async getActiveTheme(@Param('brandId') brandId: string) {
    return this.themeService.getActiveTheme(brandId);
  }

  @Post('brand/:brandId')
  async createTheme(
    @Param('brandId') brandId: string,
    @Body() data: any
  ) {
    return this.themeService.createTheme(brandId, data);
  }

  @Put('brand/:brandId/colors')
  async updateColors(
    @Param('brandId') brandId: string,
    @Body() body: { themeMode: string, colors: any[] }
  ) {
    return this.themeService.updateThemeColors(brandId, body.themeMode, body.colors);
  }
}
