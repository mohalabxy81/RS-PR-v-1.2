import { CreateOrganizationDto, UpdateOrganizationDto, CreateRegionDto, CreateDepartmentDto, CreateBusinessUnitDto, CreateHierarchyDto } from '../dto/enterprise.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrganization(tenantId: string, data: CreateOrganizationDto) {
    return this.prisma.enterpriseOrganization.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async getOrganization(tenantId: string) {
    const org = await this.prisma.enterpriseOrganization.findUnique({
      where: { tenantId },
      include: {
        hierarchies: true,
        regions: true,
        departments: true,
        businessUnits: true,
      },
    });

    if (!org) {
      throw new NotFoundException('Enterprise organization not found');
    }
    return org;
  }

  async updateOrganization(tenantId: string, data: UpdateOrganizationDto) {
    return this.prisma.enterpriseOrganization.update({
      where: { tenantId },
      data,
    });
  }

  // --- Hierarchies ---

  async createHierarchy(organizationId: string, data: CreateHierarchyDto) {
    return this.prisma.enterpriseHierarchy.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  // --- Regions ---

  async createRegion(organizationId: string, data: CreateRegionDto) {
    return this.prisma.enterpriseRegion.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async getRegions(organizationId: string) {
    return this.prisma.enterpriseRegion.findMany({
      where: { organizationId },
    });
  }

  // --- Departments ---

  async createDepartment(organizationId: string, data: CreateDepartmentDto) {
    return this.prisma.enterpriseDepartment.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async getDepartments(organizationId: string) {
    return this.prisma.enterpriseDepartment.findMany({
      where: { organizationId },
    });
  }

  // --- Business Units ---

  async createBusinessUnit(organizationId: string, data: CreateBusinessUnitDto) {
    return this.prisma.enterpriseBusinessUnit.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  async getBusinessUnits(organizationId: string) {
    return this.prisma.enterpriseBusinessUnit.findMany({
      where: { organizationId },
    });
  }
}
