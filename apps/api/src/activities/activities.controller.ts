import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from "../common/decorators/current-user.decorator";
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('activities')
@Controller({ path: 'activities', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  @ApiOperation({ summary: 'List activities (with optional entity filters)' })
  async findAll(@CurrentUser() user: CurrentUserPayload, @Query() query: any) {
    return this.activitiesService.findAll(user.tenantId, query);
  }
}
