import { Controller, Post, Body, Headers, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { CommunicationWebhooksService } from './communication-webhooks.service';

@Controller('communication/webhooks')
export class CommunicationWebhooksController {
  constructor(private readonly webhooksService: CommunicationWebhooksService) {}

  @Post(':providerAccountId')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Param('providerAccountId') providerAccountId: string,
    @Body() payload: any,
    @Headers('x-hub-signature-256') signature: string,
  ) {
    // Return 200 OK immediately as per provider (e.g. WhatsApp) requirements
    // and queue the processing.
    await this.webhooksService.processIncomingWebhook(providerAccountId, payload, signature || '');
    return { success: true };
  }
}
