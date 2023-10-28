import { Controller, Get, Param, Put } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('USER')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiParam({ name: 'telegram_id' })
  @Get('check-account/:telegram_id')
  checkUserAccount(@Param('telegram_id') telegram_id: string) {
    return this.userService.checkUserAccount(telegram_id);
  }

  @ApiParam({ name: 'telegram_id' })
  @Get('referral-count/:telegram_id')
  getReferralCount(@Param('telegram_id') telegram_id: string) {
    return this.userService.getReferralCount(telegram_id);
  }

  @ApiParam({ name: 'telegram_id' })
  @Get('get/link/:telegram_id')
  getgroupLink(@Param('telegram_id') telegram_id: string) {
    return this.userService.getGroupLink(telegram_id);
  }

  @ApiParam({ name: 'telegram_id' })
  @Get('get/unpaid-users')
  getUnpaidUsers() {
    return this.userService.getUnverifiedUsers();
  }

  @ApiParam({ name: 'user_id' })
  @Put('approve/:user_id')
  approveAccount(@Param('user_id') user_id: string) {
    return this.userService.markAccountasHasPaid(user_id);
  }
}
