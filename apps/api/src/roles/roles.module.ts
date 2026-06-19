import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  imports: [PrismaModule],
  providers: [RolesService, PermissionsGuard],
  controllers: [RolesController],
  exports: [RolesService, PermissionsGuard],
})
export class RolesModule {}
