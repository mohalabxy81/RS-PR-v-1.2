import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { DeveloperService } from '../services/developer.service';
import { RegisterDeveloperDto, CreateOrganizationDto, CreateTeamDto, CreateProjectDto } from '../dto/developer.dto';

@ApiTags('platform-developers')
@ApiBearerAuth('access-token')
@Controller({ path: 'platform/developers', version: '1' })
export class DeveloperController {
  constructor(private readonly developerService: DeveloperService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new developer account' })
  @ApiResponse({ status: 201, description: 'Developer registered successfully' })
  @ApiBody({ type: RegisterDeveloperDto })
  async registerDeveloper(@Body() body: RegisterDeveloperDto) {
    const { userId, ...data } = body;
    return this.developerService.registerDeveloper(userId, data);
  }

  @Get('profile/:userId')
  @ApiOperation({ summary: 'Get developer profile by user ID' })
  @ApiResponse({ status: 200, description: 'Developer profile returned' })
  @ApiResponse({ status: 404, description: 'Developer not found' })
  async getDeveloperProfile(@Param('userId') userId: string) {
    return this.developerService.getDeveloperProfile(userId);
  }

  @Post(':developerId/organizations')
  @ApiOperation({ summary: 'Create a developer organization' })
  @ApiResponse({ status: 201, description: 'Organization created' })
  @ApiBody({ type: CreateOrganizationDto })
  async createOrganization(
    @Param('developerId') developerId: string,
    @Body() data: CreateOrganizationDto
  ) {
    return this.developerService.createOrganization(developerId, data);
  }

  @Get('organizations/:orgId')
  @ApiOperation({ summary: 'Get a developer organization by ID' })
  @ApiResponse({ status: 200, description: 'Organization returned' })
  async getOrganization(@Param('orgId') orgId: string) {
    return this.developerService.getOrganization(orgId);
  }

  @Post('organizations/:orgId/teams')
  @ApiOperation({ summary: 'Create a team within an organization' })
  @ApiResponse({ status: 201, description: 'Team created' })
  @ApiBody({ type: CreateTeamDto })
  async createTeam(
    @Param('orgId') orgId: string,
    @Body() data: CreateTeamDto
  ) {
    return this.developerService.createTeam(orgId, data);
  }

  @Post(':developerId/projects')
  @ApiOperation({ summary: 'Create a developer project' })
  @ApiResponse({ status: 201, description: 'Project created' })
  @ApiBody({ type: CreateProjectDto })
  async createProject(
    @Param('developerId') developerId: string,
    @Body() data: CreateProjectDto
  ) {
    return this.developerService.createProject(developerId, data);
  }

  @Get('projects/:projectId')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({ status: 200, description: 'Project returned' })
  async getProject(@Param('projectId') projectId: string) {
    return this.developerService.getProject(projectId);
  }
}
