import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { DatabaseService } from 'src/database/database.service';
import { EmailServiceService } from 'src/email-service/email-service.service';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, DatabaseService, EmailServiceService],
})
export class WebhookModule {}
