import { Version, Controller, Get, Post, Put, Body, Param, Query, UseGuards, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../roles/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PERMISSIONS } from '../roles/permissions.constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { CreateLeadDto, UpdateLeadDto, AssignLeadDto, AddLeadNoteDto, QueryLeadDto } from './dto/lead.dto';

@ApiTags('leads')
@Controller({ path: 'leads', version: '1' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lead' })
  @RequirePermissions(PERMISSIONS.CREATE_LEAD)
  async create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateLeadDto) {
    return this.leadsService.create(user.tenantId, user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all leads with pagination and filters' })
  @RequirePermissions(PERMISSIONS.READ_LEAD)
  async findAll(@CurrentUser() user: CurrentUserPayload, @Query() query: QueryLeadDto) {
    return this.leadsService.findAll(user.tenantId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead details' })
  @ApiParam({ name: 'id', type: String })
  @RequirePermissions(PERMISSIONS.READ_LEAD)
  async findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.leadsService.findOne(user.tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a lead' })
  @ApiParam({ name: 'id', type: String })
  @RequirePermissions(PERMISSIONS.UPDATE_LEAD)
  async update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateLeadDto,
  ) {
    return this.leadsService.update(user.tenantId, id, dto, user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Archive a lead' })
  @ApiParam({ name: 'id', type: String })
  @RequirePermissions(PERMISSIONS.DELETE_LEAD)
  async archive(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.leadsService.archive(user.tenantId, id);
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Add a note to a lead' })
  @ApiParam({ name: 'id', type: String })
  @RequirePermissions(PERMISSIONS.UPDATE_LEAD)
  async addNote(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: AddLeadNoteDto,
  ) {
    return this.leadsService.addNote(user.tenantId, id, user.userId, dto.content);
  }

  @Put(':id/assign')
  @ApiOperation({ summary: 'Assign a lead to an agent' })
  @ApiParam({ name: 'id', type: String })
  @RequirePermissions(PERMISSIONS.ASSIGN_LEAD)
  async assign(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: AssignLeadDto,
  ) {
    return this.leadsService.assign(user.tenantId, id, dto.assigneeId, user.userId);
  }

  @Get(':id/timeline')
  @ApiOperation({ summary: 'Get lead activity timeline' })
  @ApiParam({ name: 'id', type: String })
  @RequirePermissions(PERMISSIONS.READ_LEAD)
  async getTimeline(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.leadsService.getTimeline(user.tenantId, id);
  }
}
