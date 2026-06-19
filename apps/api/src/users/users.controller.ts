import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../roles/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PERMISSIONS } from '../roles/permissions.constants';
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @RequirePermissions(PERMISSIONS.CREATE_USER)
  async create(@CurrentUser() user: CurrentUserPayload, @Body() data: CreateUserDto) {
    return this.usersService.create(user.tenantId, data);
  }

  @Get()
  @ApiOperation({ summary: 'List all users in tenant' })
  @RequirePermissions(PERMISSIONS.READ_USER)
  async findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.usersService.findAll(user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details' })
  @RequirePermissions(PERMISSIONS.READ_USER)
  async findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.usersService.findOne(user.tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiBody({ type: UpdateUserDto })
  @RequirePermissions(PERMISSIONS.UPDATE_USER)
  async update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ) {
    return this.usersService.update(user.tenantId, id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @RequirePermissions(PERMISSIONS.DELETE_USER)
  async remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.usersService.remove(user.tenantId, id);
  }
}
