import { Version, Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { PartnerService } from '../services/partner.service';
import { RegisterPartnerDto, UpdatePartnerDto, CreateProgramDto } from '../dto/partner.dto';

@ApiTags('platform-partners')
@ApiBearerAuth('access-token')
@Controller({ path: 'platform/partners', version: '1' })
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @RequirePermissions('platform.manage')
  @Post('register')
  @ApiOperation({ summary: 'Register a new partner account' })
  @ApiResponse({ status: 201, description: 'Partner account created (PENDING approval)' })
  @ApiBody({ type: RegisterPartnerDto })
  async registerPartner(@Body() body: RegisterPartnerDto) {
    const { userId, ...data } = body;
    return this.partnerService.registerPartner(userId, data);
  }

  @RequirePermissions('platform.manage')
  @Get('profile/:userId')
  @ApiOperation({ summary: 'Get partner profile by user ID' })
  @ApiResponse({ status: 200, description: 'Partner profile returned' })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async getPartnerProfile(@Param('userId') userId: string) {
    return this.partnerService.getPartnerProfile(userId);
  }

  @RequirePermissions('platform.manage')
  @Put(':partnerId')
  @ApiOperation({ summary: 'Update partner account details' })
  @ApiResponse({ status: 200, description: 'Partner account updated' })
  @ApiBody({ type: UpdatePartnerDto })
  async updatePartner(
    @Param('partnerId') partnerId: string,
    @Body() data: UpdatePartnerDto
  ) {
    return this.partnerService.updatePartner(partnerId, data);
  }

  @RequirePermissions('platform.manage')
  @Post(':partnerId/programs')
  @ApiOperation({ summary: 'Enroll a partner in a program' })
  @ApiResponse({ status: 201, description: 'Partner enrolled in program' })
  @ApiBody({ type: CreateProgramDto })
  async joinProgram(
    @Param('partnerId') partnerId: string,
    @Body() data: CreateProgramDto
  ) {
    return this.partnerService.joinProgram(partnerId, data);
  }

  @RequirePermissions('platform.manage')
  @Get(':partnerId/programs')
  @ApiOperation({ summary: 'List partner programs' })
  @ApiResponse({ status: 200, description: 'List of programs' })
  async getPrograms(@Param('partnerId') partnerId: string) {
    return this.partnerService.getPrograms(partnerId);
  }
}
