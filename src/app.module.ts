import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { UserModule } from './user/user.module';
import { EmailServiceService } from './email-service/email-service.service';
import { WebhookModule } from './webhook/webhook.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { WithdrawalModule } from './withdrawal/withdrawal.module';

@Module({
  imports: [
    AuthModule,
    PaymentModule,
    UserModule,
    WebhookModule,
    AnalyticsModule,
    WithdrawalModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService, EmailServiceService],
})
export class AppModule {}
