import { Version, Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { AiAdminService } from './ai-admin.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CreateAiProviderDto, CreateAiModelDto, CreateAiPromptDto, CreatePromptVersionDto } from './dto/ai-admin.dto';

@ApiTags('AI Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai/admin')
export class AiAdminController {
  constructor(private readonly aiAdminService: AiAdminService) {}

  // ─── PROVIDERS ──────────────────────────────────────────────────────────

  @RequirePermissions('ai.manage')
  @Get('providers')
  @ApiOperation({ summary: 'List AI providers' })
  async listProviders(@Request() req: any) {
    return this.aiAdminService.listProviders(req.user.tenantId);
  }

  @RequirePermissions('ai.manage')
  @Post('providers')
  @ApiOperation({ summary: 'Create a new AI provider' })
  @ApiBody({ type: CreateAiProviderDto })
  async createProvider(@Body() body: CreateAiProviderDto, @Request() req: any) {
    return this.aiAdminService.createProvider(req.user.tenantId, body);
  }

  // ─── MODELS ─────────────────────────────────────────────────────────────

  @RequirePermissions('ai.manage')
  @Get('models')
  @ApiOperation({ summary: 'List AI models' })
  async listModels(@Request() req: any) {
    return this.aiAdminService.listModels(req.user.tenantId);
  }

  @RequirePermissions('ai.manage')
  @Post('models')
  @ApiOperation({ summary: 'Create a new AI model' })
  @ApiBody({ type: CreateAiModelDto })
  async createModel(@Body() body: CreateAiModelDto, @Request() req: any) {
    return this.aiAdminService.createModel(req.user.tenantId, body);
  }

  // ─── PROMPTS ────────────────────────────────────────────────────────────

  @RequirePermissions('ai.manage')
  @Get('prompts')
  @ApiOperation({ summary: 'List all prompt templates' })
  async listPrompts(@Request() req: any) {
    return this.aiAdminService.listPrompts(req.user.tenantId);
  }

  @RequirePermissions('ai.manage')
  @Post('prompts')
  @ApiOperation({ summary: 'Create a new prompt template' })
  @ApiBody({ type: CreateAiPromptDto })
  async createPrompt(@Body() body: CreateAiPromptDto, @Request() req: any) {
    return this.aiAdminService.createPrompt({ tenantId: req.user.tenantId, ...body });
  }

  @RequirePermissions('ai.manage')
  @Post('prompts/:id/versions')
  @ApiOperation({ summary: 'Create a new version for a prompt' })
  @ApiBody({ type: CreatePromptVersionDto })
  async createPromptVersion(@Param('id') id: string, @Body() body: CreatePromptVersionDto, @Request() req: any) {
    return this.aiAdminService.createPromptVersion(id, body.content, req.user.id);
  }

  @RequirePermissions('ai.manage')
  @Post('prompts/:promptId/versions/:versionId/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate a specific prompt version' })
  async activatePromptVersion(@Param('promptId') promptId: string, @Param('versionId') versionId: string) {
    return this.aiAdminService.activatePromptVersion(promptId, versionId);
  }
}
