import { Version, Controller, Get, Post, Put, Body, Param, Query, UseGuards, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { DealsService } from './deals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../roles/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PERMISSIONS } from '../roles/permissions.constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { CreateDealDto, UpdateDealDto, UpdateDealStageDto, AddDealNoteDto, QueryDealDto } from './dto/deal.dto';

@ApiTags('deals')
@Controller({ path: 'deals', version: '1' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @RequirePermissions('create:deals')
  @Post()
  @ApiOperation({ summary: 'Create a new deal' })
  @RequirePermissions(PERMISSIONS.CREATE_DEAL)
  async create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateDealDto) {
    return this.dealsService.create(user.tenantId, user.userId, dto);
  }

  @RequirePermissions('read:deals')
  @Get()
  @ApiOperation({ summary: 'List all deals (useful for Kanban board)' })
  @RequirePermissions(PERMISSIONS.READ_DEAL)
  async findAll(@CurrentUser() user: CurrentUserPayload, @Query() query: QueryDealDto) {
    return this.dealsService.findAll(user.tenantId, query);
  }

  @RequirePermissions('read:deals')
  @Get(':id')
  @ApiOperation({ summary: 'Get deal details' })
  @ApiParam({ name: 'id', type: String })
  @RequirePermissions(PERMISSIONS.READ_DEAL)
  async findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.dealsService.findOne(user.tenantId, id);
  }

  @RequirePermissions('update:deals')
  @Put(':id')
  @ApiOperation({ summary: 'Update a deal' })
  @ApiParam({ name: 'id', type: String })
  @RequirePermissions(PERMISSIONS.UPDATE_DEAL)
  async update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateDealDto,
  ) {
    return this.dealsService.update(user.tenantId, id, dto, user.userId);
  }

  @RequirePermissions('update:deals')
  @Put(':id/stage')
  @ApiOperation({ summary: 'Change deal stage (records history)' })
  @ApiParam({ name: 'id', type: String })
  @RequirePermissions(PERMISSIONS.UPDATE_DEAL)
  async updateStage(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateDealStageDto,
  ) {
    return this.dealsService.updateStage(user.tenantId, id, user.userId, dto.stage);
  }

  @RequirePermissions('create:deals')
  @Post(':id/notes')
  @ApiOperation({ summary: 'Add a note to a deal' })
  @ApiParam({ name: 'id', type: String })
  @RequirePermissions(PERMISSIONS.UPDATE_DEAL)
  async addNote(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: AddDealNoteDto,
  ) {
    return this.dealsService.addNote(user.tenantId, id, user.userId, dto.content);
  }
}
