import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { UserModule } from './user/user.module';
import { EmailServiceService } from './email-service/email-service.service';

@Module({
  imports: [AuthModule, PaymentModule, UserModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService, EmailServiceService],
})
export class AppModule {}
