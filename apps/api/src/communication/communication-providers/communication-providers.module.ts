import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CommunicationProvidersService } from './communication-providers.service';

@Module({
  imports: [PrismaModule],
  providers: [CommunicationProvidersService],
  exports: [CommunicationProvidersService],
})
export class CommunicationProvidersModule {}
