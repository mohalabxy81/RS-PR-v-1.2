import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IMessagingProvider, SendMessagePayload, SendMessageResult } from '../communication-core/interfaces';
import { ProviderType } from '../communication-core/enums';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CommunicationProvidersService {
  private readonly logger = new Logger(CommunicationProvidersService.name);
  private providers: Map<ProviderType, IMessagingProvider> = new Map();

  constructor(private prisma: PrismaService) {
    // In a real implementation, you would register provider instances here
    // this.providers.set(ProviderType.WHATSAPP, new WhatsAppProvider());
  }

  registerProvider(type: ProviderType, provider: IMessagingProvider) {
    this.providers.set(type, provider);
  }

  getProvider(type: ProviderType): IMessagingProvider {
    const provider = this.providers.get(type);
    if (!provider) {
      throw new NotFoundException(`Provider implementation for ${type} not found`);
    }
    return provider;
  }

  async sendMessage(accountId: string, payload: SendMessagePayload): Promise<SendMessageResult> {
    const account = await this.prisma.providerAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException(`Provider account ${accountId} not found`);
    }

    const provider = this.getProvider(account.providerType as ProviderType);
    return provider.sendMessage(accountId, payload);
  }
}
