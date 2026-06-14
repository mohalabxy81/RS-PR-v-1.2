import { MessageDirection, MessageType, ProviderType } from './enums';

export interface SendMessagePayload {
  to: string;
  type: MessageType;
  content?: string;
  mediaUrl?: string;
  template?: {
    name: string;
    language: string;
    components: any[];
  };
}

export interface SendMessageResult {
  messageId: string;
  providerMessageId?: string;
  status: string;
}

export interface IMessagingProvider {
  sendMessage(
    accountId: string,
    payload: SendMessagePayload,
  ): Promise<SendMessageResult>;

  verifyWebhookSignature(signature: string, payload: any): boolean;

  getHealth(accountId: string): Promise<{ status: string; latencyMs: number }>;
}
