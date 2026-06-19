import { Version, Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../roles/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PERMISSIONS } from '../roles/permissions.constants';
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('appointments')
@Controller({ path: 'appointments', version: '1' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiBody({ type: CreateAppointmentDto })
  @RequirePermissions(PERMISSIONS.CREATE_APPOINTMENT)
  async create(@CurrentUser() user: CurrentUserPayload, @Body() data: CreateAppointmentDto) {
    return this.appointmentsService.create(user.tenantId, user.userId, data);
  }

  @Get()
  @ApiOperation({ summary: 'List all appointments in a date range' })
  @RequirePermissions(PERMISSIONS.READ_APPOINTMENT)
  async findAll(@CurrentUser() user: CurrentUserPayload, @Query() query: any) {
    return this.appointmentsService.findAll(user.tenantId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment details' })
  @RequirePermissions(PERMISSIONS.READ_APPOINTMENT)
  async findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.appointmentsService.findOne(user.tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an appointment' })
  @ApiBody({ type: UpdateAppointmentDto })
  @RequirePermissions(PERMISSIONS.UPDATE_APPOINTMENT)
  async update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() data: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(user.tenantId, id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an appointment' })
  @RequirePermissions(PERMISSIONS.DELETE_APPOINTMENT)
  async remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.appointmentsService.remove(user.tenantId, id);
  }
}
