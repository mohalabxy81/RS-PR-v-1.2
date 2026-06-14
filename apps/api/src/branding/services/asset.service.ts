import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AssetService {
  constructor(private prisma: PrismaService) {}

  async getAssets(brandId: string) {
    return this.prisma.brandAsset.findMany({
      where: { brandId },
    });
  }

  async uploadAsset(brandId: string, file: any, assetType: string) {
    // Basic mock implementation for uploading an asset
    return this.prisma.brandAsset.create({
      data: {
        brandId,
        name: file.originalname,
        url: `https://cdn.example.com/assets/${file.originalname}`,
        assetType,
        mimeType: file.mimetype,
        fileSize: file.size,
      },
    });
  }

  async deleteAsset(assetId: string) {
    return this.prisma.brandAsset.delete({
      where: { id: assetId },
    });
  }
}
