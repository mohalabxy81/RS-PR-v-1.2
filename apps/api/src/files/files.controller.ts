import { Version, Controller, Post, Body, Get, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../roles/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PERMISSIONS } from '../roles/permissions.constants';
import { CurrentUser } from "../common/decorators/current-user.decorator";
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('files')
@Controller({ path: 'files', version: '1' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @RequirePermissions('create:files')
  @Post('upload-url')
  @ApiOperation({ summary: 'Request a pre-signed URL to upload a file directly to S3' })
  @RequirePermissions(PERMISSIONS.UPLOAD_FILE)
  async getUploadUrl(
    @CurrentUser() user: CurrentUserPayload,
    @Body('filename') filename: string,
    @Body('contentType') contentType: string,
    @Body('folder') folder?: string,
  ) {
    return this.filesService.getUploadUrl(user.tenantId, filename, contentType, folder);
  }

  @RequirePermissions('read:files')
  @Get('download-url')
  @ApiOperation({ summary: 'Request a pre-signed URL to download a private file' })
  async getDownloadUrl(
    @CurrentUser() user: CurrentUserPayload, // Note: In a real app we'd verify the key belongs to this tenant!
    @Query('key') key: string,
  ) {
    if (!key.startsWith(`tenants/${user.tenantId}/`)) {
      // Basic security check: user can only request URLs for their own tenant's folder
      throw new Error('Unauthorized file access');
    }
    const url = await this.filesService.getDownloadUrl(user.tenantId, key);
    return { url };
  }
}
