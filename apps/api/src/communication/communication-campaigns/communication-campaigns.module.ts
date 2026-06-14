import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../../prisma/prisma.module';
import { CommunicationCampaignsController } from './communication-campaigns.controller';
import { CommunicationCampaignsService } from './communication-campaigns.service';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({ name: 'campaigns' }),
  ],
  controllers: [CommunicationCampaignsController],
  providers: [CommunicationCampaignsService],
  exports: [CommunicationCampaignsService],
})
export class CommunicationCampaignsModule {}
