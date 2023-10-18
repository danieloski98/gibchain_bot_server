import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { HttpModule } from '@nestjs/axios';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, DatabaseService],
  imports: [HttpModule],
})
export class PaymentModule {}
