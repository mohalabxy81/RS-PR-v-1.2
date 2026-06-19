import {
  Controller, Post, Get, Delete, Body, Param, Query,
  UseGuards, Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { AiChatService, ChatRequestDto } from './ai-chat.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('AI Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai/chat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @RequirePermissions('ai.manage')
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a message to the AI Copilot' })
  async chat(@Body() body: Omit<ChatRequestDto, 'tenantId' | 'userId'>, @Request() req: any) {
    return this.aiChatService.chat({
      ...body,
      tenantId: req.user.tenantId,
      userId: req.user.id,
    });
  }

  @RequirePermissions('ai.manage')
  @Get('conversations')
  @ApiOperation({ summary: 'List all AI conversations for the current user' })
  async listConversations(
    @Request() req: any,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.aiChatService.listConversations(req.user.tenantId, req.user.id, +page, +limit);
  }

  @RequirePermissions('ai.manage')
  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get a conversation with all messages' })
  async getConversation(@Param('id') id: string, @Request() req: any) {
    return this.aiChatService.getConversation(id, req.user.tenantId, req.user.id);
  }

  @RequirePermissions('ai.manage')
  @Delete('conversations/:id')
  @ApiOperation({ summary: 'Delete a conversation' })
  async deleteConversation(@Param('id') id: string, @Request() req: any) {
    return this.aiChatService.deleteConversation(id, req.user.tenantId, req.user.id);
  }
}
