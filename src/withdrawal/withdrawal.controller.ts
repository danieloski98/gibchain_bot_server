import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { WithdrawalService } from './withdrawal.service';
import { WithdrawalDTO } from './dto/createwithdrawalDTO';

@ApiTags('WITHDRAWALS')
@Controller('withdrawal')
export class WithdrawalController {
  constructor(private wiithdrawalService: WithdrawalService) {}

  @ApiParam({ name: 'telegram_id' })
  @Get(':telegram_id')
  getUserDetails(@Param('telegram_id') telegram_id: string) {
    return this.wiithdrawalService.getAvaliableWidthdrawal(telegram_id);
  }

  @ApiBody({ type: WithdrawalDTO })
  @Post('create')
  createWithdrawal(@Body() body: WithdrawalDTO) {
    return this.wiithdrawalService.createWithdrawal(body);
  }

  @ApiParam({ name: 'transaction_id' })
  @Put('approve/:transaction_id')
  approveWithdrawal(@Param('transaction_id') transaction_id: string) {
    return this.wiithdrawalService.approveWithdrawal({ transaction_id });
  }

  @Get('all/transations')
  getAllTransactions() {
    return this.wiithdrawalService.getAllWithdrrawals();
  }

  @Get('pending/transations')
  getAllPendingTransactions() {
    return this.wiithdrawalService.getAllPendingWithdrrawals();
  }
}
