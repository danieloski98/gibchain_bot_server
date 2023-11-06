import { Module } from '@nestjs/common';
import { WithdrawalController } from './withdrawal.controller';
import { WithdrawalService } from './withdrawal.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [WithdrawalController],
  providers: [WithdrawalService, DatabaseService],
})
export class WithdrawalModule {}
