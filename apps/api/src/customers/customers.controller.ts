import { Version, Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../roles/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PERMISSIONS } from '../roles/permissions.constants';
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { CreateCustomerDto, UpdateCustomerDto, QueryCustomerDto, AddCustomerNoteDto } from './dto/customer.dto';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('customers')
@Controller({ path: 'customers', version: '1' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @RequirePermissions('create:customers')
  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiBody({ type: CreateCustomerDto })
  @RequirePermissions(PERMISSIONS.CREATE_CUSTOMER)
  async create(@CurrentUser() user: CurrentUserPayload, @Body() data: CreateCustomerDto) {
    return this.customersService.create(user.tenantId, data);
  }

  @RequirePermissions('read:customers')
  @Get()
  @ApiOperation({ summary: 'List all customers' })
  @RequirePermissions(PERMISSIONS.READ_CUSTOMER)
  async findAll(@CurrentUser() user: CurrentUserPayload, @Query() query: QueryCustomerDto) {
    return this.customersService.findAll(user.tenantId, query);
  }

  @RequirePermissions('read:customers')
  @Get(':id')
  @ApiOperation({ summary: 'Get customer details' })
  @RequirePermissions(PERMISSIONS.READ_CUSTOMER)
  async findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.customersService.findOne(user.tenantId, id);
  }

  @RequirePermissions('update:customers')
  @Put(':id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiBody({ type: UpdateCustomerDto })
  @RequirePermissions(PERMISSIONS.UPDATE_CUSTOMER)
  async update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() data: UpdateCustomerDto,
  ) {
    return this.customersService.update(user.tenantId, id, data);
  }

  @RequirePermissions('create:customers')
  @Post(':id/notes')
  @ApiOperation({ summary: 'Add a note to a customer' })
  @ApiBody({ type: AddCustomerNoteDto })
  @RequirePermissions(PERMISSIONS.UPDATE_CUSTOMER)
  async addNote(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() body: AddCustomerNoteDto,
  ) {
    return this.customersService.addNote(user.tenantId, id, user.userId, body.content);
  }
}
