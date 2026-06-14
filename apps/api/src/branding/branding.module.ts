import { Module } from '@nestjs/common';
import { BrandController } from './controllers/brand.controller';
import { ThemeController } from './controllers/theme.controller';
import { DomainController } from './controllers/domain.controller';
import { AssetController } from './controllers/asset.controller';
import { BrandService } from './services/brand.service';
import { ThemeService } from './services/theme.service';
import { DomainService } from './services/domain.service';
import { AssetService } from './services/asset.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    BrandController, 
    ThemeController,
    DomainController,
    AssetController
  ],
  providers: [
    BrandService, 
    ThemeService,
    DomainService,
    AssetService
  ],
  exports: [
    BrandService, 
    ThemeService,
    DomainService,
    AssetService
  ],
})
export class BrandingModule {}
