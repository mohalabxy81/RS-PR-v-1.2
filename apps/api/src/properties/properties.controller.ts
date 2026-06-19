import { Version, Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../roles/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PERMISSIONS } from '../roles/permissions.constants';
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { CreatePropertyDto, UpdatePropertyDto, QueryPropertyDto } from './dto/property.dto';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('properties')
@Controller({ path: 'properties', version: '1' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @RequirePermissions('create:properties')
  @Post()
  @ApiOperation({ summary: 'Create a new property' })
  @ApiBody({ type: CreatePropertyDto })
  @RequirePermissions(PERMISSIONS.CREATE_PROPERTY)
  async create(@CurrentUser() user: CurrentUserPayload, @Body() data: CreatePropertyDto) {
    return this.propertiesService.create(user.tenantId, data);
  }

  @RequirePermissions('read:properties')
  @Get()
  @ApiOperation({ summary: 'List properties with filters' })
  @RequirePermissions(PERMISSIONS.READ_PROPERTY)
  async findAll(@CurrentUser() user: CurrentUserPayload, @Query() query: QueryPropertyDto) {
    return this.propertiesService.findAll(user.tenantId, query);
  }

  @RequirePermissions('read:properties')
  @Get(':id')
  @ApiOperation({ summary: 'Get property details' })
  @RequirePermissions(PERMISSIONS.READ_PROPERTY)
  async findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.propertiesService.findOne(user.tenantId, id);
  }

  @RequirePermissions('update:properties')
  @Put(':id')
  @ApiOperation({ summary: 'Update property details' })
  @ApiBody({ type: UpdatePropertyDto })
  @RequirePermissions(PERMISSIONS.UPDATE_PROPERTY)
  async update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() data: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(user.tenantId, id, data);
  }

  @RequirePermissions('update:properties')
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
