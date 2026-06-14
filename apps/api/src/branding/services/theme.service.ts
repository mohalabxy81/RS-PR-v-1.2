import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ThemeService {
  constructor(private prisma: PrismaService) {}

  async getThemes(brandId: string) {
    return this.prisma.brandTheme.findMany({
      where: { brandId },
    });
  }

  async getActiveTheme(brandId: string) {
    const theme = await this.prisma.brandTheme.findFirst({
      where: { brandId, isDefault: true },
    });
    return theme;
  }

  async createTheme(brandId: string, data: any) {
    return this.prisma.brandTheme.create({
      data: {
        ...data,
        brandId,
      },
    });
  }

  async updateThemeColors(brandId: string, themeMode: string, colors: any[]) {
    // In a real app we would upsert each color
    for (const color of colors) {
      // Logic to upsert brand colors
    }
    return { success: true };
  }
}
