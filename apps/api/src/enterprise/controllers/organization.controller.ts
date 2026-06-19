import { CreateOrganizationDto, UpdateOrganizationDto, CreateRegionDto, CreateDepartmentDto, CreateBusinessUnitDto, CreateHierarchyDto } from '../dto/enterprise.dto';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Version, Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { OrganizationService } from '../services/organization.service';

@ApiTags('Enterprise / Organization')
@Controller('enterprise/organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @RequirePermissions('enterprise.manage')
  @Get(':tenantId')
  async getOrganization(@Param('tenantId') tenantId: string) {
    return this.organizationService.getOrganization(tenantId);
  }

  @RequirePermissions('enterprise.manage')
  @Post(':tenantId')
  async createOrganization(
    @Param('tenantId') tenantId: string,
    @Body() data: CreateOrganizationDto
  ) {
    return this.organizationService.createOrganization(tenantId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Put(':tenantId')
  async updateOrganization(
    @Param('tenantId') tenantId: string,
    @Body() data: UpdateOrganizationDto
  ) {
    return this.organizationService.updateOrganization(tenantId, data);
  }

  // --- Regions ---

  @RequirePermissions('enterprise.manage')
  @Post(':organizationId/regions')
  async createRegion(
    @Param('organizationId') organizationId: string,
    @Body() data: CreateRegionDto
  ) {
    return this.organizationService.createRegion(organizationId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Get(':organizationId/regions')
  async getRegions(@Param('organizationId') organizationId: string) {
    return this.organizationService.getRegions(organizationId);
  }

  // --- Departments ---

  @RequirePermissions('enterprise.manage')
  @Post(':organizationId/departments')
  async createDepartment(
    @Param('organizationId') organizationId: string,
    @Body() data: CreateDepartmentDto
  ) {
    return this.organizationService.createDepartment(organizationId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Get(':organizationId/departments')
  async getDepartments(@Param('organizationId') organizationId: string) {
    return this.organizationService.getDepartments(organizationId);
  }

  // --- Business Units ---

  @RequirePermissions('enterprise.manage')
  @Post(':organizationId/business-units')
  async createBusinessUnit(
    @Param('organizationId') organizationId: string,
    @Body() data: CreateBusinessUnitDto
  ) {
    return this.organizationService.createBusinessUnit(organizationId, data);
  }

  @RequirePermissions('enterprise.manage')
  @Get(':organizationId/business-units')
  async getBusinessUnits(@Param('organizationId') organizationId: string) {
    return this.organizationService.getBusinessUnits(organizationId);
  }

  // --- Hierarchies ---

  @RequirePermissions('enterprise.manage')
  @Post(':organizationId/hierarchies')
  async createHierarchy(
    @Param('organizationId') organizationId: string,
    @Body() data: CreateHierarchyDto
  ) {
    return this.organizationService.createHierarchy(organizationId, data);
  }
}
