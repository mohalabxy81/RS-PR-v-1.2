import { Version, Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { BranchesService } from './branches.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../roles/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PERMISSIONS } from '../roles/permissions.constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('branches')
@Controller({ path: 'branches', version: '1' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @RequirePermissions('create:branches')
  @Post()
  @ApiOperation({ summary: 'Create a new branch' })
  @ApiBody({ type: CreateBranchDto })
  @RequirePermissions(PERMISSIONS.CREATE_BRANCH)
  async create(@CurrentUser() user: CurrentUserPayload, @Body() data: CreateBranchDto) {
    return this.branchesService.create(user.tenantId, data);
  }

  @RequirePermissions('read:branches')
  @Get()
  @ApiOperation({ summary: 'List all branches' })
  @RequirePermissions(PERMISSIONS.READ_BRANCH)
  async findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.branchesService.findAll(user.tenantId);
  }

  @RequirePermissions('read:branches')
  @Get(':id')
  @ApiOperation({ summary: 'Get branch details' })
  @RequirePermissions(PERMISSIONS.READ_BRANCH)
  async findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.branchesService.findOne(user.tenantId, id);
  }

  @RequirePermissions('update:branches')
  @Put(':id')
  @ApiOperation({ summary: 'Update a branch' })
  @ApiBody({ type: UpdateBranchDto })
  @RequirePermissions(PERMISSIONS.UPDATE_BRANCH)
  async update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() data: UpdateBranchDto,
  ) {
    return this.branchesService.update(user.tenantId, id, data);
  }

  @RequirePermissions('delete:branches')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a branch' })
  @RequirePermissions(PERMISSIONS.DELETE_BRANCH)
  async remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.branchesService.remove(user.tenantId, id);
  }
}
