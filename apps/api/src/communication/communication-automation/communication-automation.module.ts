import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../../prisma/prisma.module';
import { CommunicationAutomationController } from './communication-automation.controller';
import { CommunicationAutomationService } from './communication-automation.service';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({ name: 'automations' }),
  ],
  controllers: [CommunicationAutomationController],
  providers: [CommunicationAutomationService],
  exports: [CommunicationAutomationService],
})
export class CommunicationAutomationModule {}
