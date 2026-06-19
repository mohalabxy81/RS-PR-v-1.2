import { Version, Controller, Post, Get, Body, Query, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { AiFeedbackService } from './ai-feedback.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('AI Feedback')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai/feedback')
export class AiFeedbackController {
  constructor(private readonly aiFeedbackService: AiFeedbackService) {}

  @RequirePermissions('ai.manage')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit feedback for an AI response' })
  async submitFeedback(
    @Body() body: { responseId?: string; isPositive: boolean; comments?: string },
    @Request() req: any,
  ) {
    return this.aiFeedbackService.submitFeedback({
      tenantId: req.user.tenantId,
      userId: req.user.id,
      ...body,
    });
  }

  @RequirePermissions('ai.manage')
  @Get()
  @ApiOperation({ summary: 'Get all AI feedback (admin/manager)' })
  async getFeedback(
    @Request() req: any,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.aiFeedbackService.getFeedback(req.user.tenantId, +page, +limit);
  }
}
