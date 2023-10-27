import { Body, Controller, Post } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookDTO } from './webhook.dto';

@Controller('webhook')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post()
  actonwebhook(@Body() body: WebhookDTO) {
    return body;
  }
}
