import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../roles/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PERMISSIONS } from '../roles/permissions.constants';
import { CurrentUser } from "../common/decorators/current-user.decorator";
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('properties')
@Controller({ path: 'properties', version: '1' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new property' })
  @RequirePermissions(PERMISSIONS.CREATE_PROPERTY)
  async create(@CurrentUser() user: CurrentUserPayload, @Body() data: any) {
    return this.propertiesService.create(user.tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'List properties with filters' })
  @RequirePermissions(PERMISSIONS.READ_PROPERTY)
  async findAll(@CurrentUser() user: CurrentUserPayload, @Query() query: any) {
    return this.propertiesService.findAll(user.tenantId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property details' })
  @RequirePermissions(PERMISSIONS.READ_PROPERTY)
  async findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.propertiesService.findOne(user.tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update property details' })
  @RequirePermissions(PERMISSIONS.UPDATE_PROPERTY)
  async update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.propertiesService.update(user.tenantId, id, data);
  }

  @Put(':id/assign')
  @ApiOperation({ summary: 'Assign a property to an agent' })
  @RequirePermissions(PERMISSIONS.UPDATE_PROPERTY)
  async assign(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body('agentId') agentId: string,
  ) {
    return this.propertiesService.assign(user.tenantId, id, agentId);
  }
}
