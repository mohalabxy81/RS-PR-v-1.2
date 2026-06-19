import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterPartnerDto, UpdatePartnerDto, CreateProgramDto } from '../dto/partner.dto';

@Injectable()
export class PartnerService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Partner Accounts ---

  async registerPartner(userId: string, data: Omit<RegisterPartnerDto, 'userId'>) {
    return this.prisma.partnerAccount.create({
      data: {
        userId,
        companyName: data.companyName,
        partnerType: data.partnerType,
        status: 'PENDING',
      },
    });
  }

  async getPartnerProfile(userId: string) {
    const partner = await this.prisma.partnerAccount.findUnique({
      where: { userId },
      include: { programs: true },
    });
    if (!partner) throw new NotFoundException('Partner profile not found');
    return partner;
  }

  async updatePartner(partnerId: string, data: UpdatePartnerDto) {
    return this.prisma.partnerAccount.update({
      where: { id: partnerId },
      data,
    });
  }

  // --- Partner Programs ---

  async joinProgram(partnerId: string, data: CreateProgramDto) {
    return this.prisma.partnerProgram.create({
      data: {
        partnerId,
        name: data.name,
        commissionRate: data.commissionRate,
        status: 'ACTIVE',
      },
    });
  }

  async getPrograms(partnerId: string) {
    return this.prisma.partnerProgram.findMany({
      where: { partnerId },
    });
  }
}
