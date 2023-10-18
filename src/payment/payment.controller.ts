import { Controller, Get, Param, Put } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('PAYMENT')
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @ApiParam({ name: 'telegram_id ' })
  @Get('get-link/:telegram_id')
  getPaymentLink(@Param('telegram_id') telegram_id: string) {
    return this.paymentService.generatePaymentLink(telegram_id);
  }

  @ApiParam({ name: 'user_id ' })
  @Put('activate-account/:user_id')
  activateAccount(@Param('user_id') user_id: string) {
    return this.paymentService.activateAccount(user_id);
  }
}
