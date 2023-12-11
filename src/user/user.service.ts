// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Telegraf } from 'telegraf';

const token = process.env.TELEGRAM_API_KEY;

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  public async checkUserAccount(telegram_id: string) {
    const user = await this.databaseService.user.findFirst({
      where: {
        telegram_id,
      },
      include: {
        referrals: true,
        Widthdrawal_request: true,
      },
    });

    // stats
    const totalMoneyEarned = await this.databaseService.user.findMany({
      where: {
        AND: {
          referral: user.telegram_id,
          has_paid: true,
        },
      },
    });

    const withdrawals = await this.databaseService.widthdrawal_request.findMany(
      {
        where: {
          AND: {
            approved: true,
            user_id: user.id,
          },
        },
      },
    );

    const referrals = await this.databaseService.user.findMany({
      where: {
        AND: {
          referral: user.telegram_id,
          has_paid: true,
        },
      },
    });

    const totalWithdrawals =
      withdrawals.length < 1
        ? 0
        : withdrawals.reduce((total, withdrawal) => {
            return total + withdrawal.amount;
          }, 0);

    // calculate
    const totalReferrals = referrals.length * 2;

    user['totalEarnings'] = totalMoneyEarned.length * 2;
    user['withdrawableAmount'] = totalReferrals - totalWithdrawals;

    if (user === null) {
      throw new BadRequestException('User not found');
    }
    return {
      message: 'User found',
      data: user,
      statusCode: 200,
    };
  }

  public async getReferralCount(telegram_id: string) {
    const user = await this.databaseService.user.findFirst({
      where: {
        telegram_id,
      },
    });

    if (user === null) {
      throw new BadRequestException('User not found');
    }

    const referrals = await this.databaseService.referrals.findMany({
      where: {
        referral_id: telegram_id,
      },
    });

    return {
      message: 'Your referrals',
      data: referrals.length,
      statusCode: 200,
    };
  }

  public async getGroupLink(telegram_id: string) {
    const user = await this.databaseService.user.findFirst({
      where: {
        telegram_id,
      },
    });

    if (user === null) {
      throw new BadRequestException('User not found');
    }

    if (!user.has_paid) {
      throw new BadRequestException('You have not paid for access');
    }

    return {
      message: 'Do not share this like with any one',
      statusCode: 200,
      data: {
        link: process.env.GROUP_LINK,
      },
    };
  }

  public async getAllUSers() {
    const users = await this.databaseService.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return {
      message: 'users',
      data: users,
      statusCode: 200,
    };
  }

  public async getApprovedUSers() {
    const users = await this.databaseService.user.findMany({
      where: {
        has_paid: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return {
      message: 'users',
      data: users,
      statusCode: 200,
    };
  }

  public async getUserById(userId: string) {
    const user = await this.databaseService.user.findFirst({
      where: { id: userId },
    });

    const referrals = await this.databaseService.user.count({
      where: {
        referral: user.telegram_id,
        has_paid: true,
      },
    });

    const withdrawal_request =
      await this.databaseService.widthdrawal_request.count({
        where: {
          user_id: user.id,
        },
      });

    return {
      message: 'user',
      data: {
        ...user,
        referrals,
        withdrawal_request,
      },
      statusCode: 200,
    };
  }

  public async getUnverifiedUsers() {
    const users = await this.databaseService.user.findMany({
      where: {
        has_paid: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      message: 'Users',
      data: users,
    };
  }

  public async markAccountasHasPaid(user_id: string) {
    const user = await this.databaseService.user.findFirst({
      where: {
        id: user_id,
      },
    });

    if (user === null) {
      throw new BadRequestException('User not found');
    }

    await this.databaseService.user.update({
      where: {
        id: user.id,
      },
      data: {
        has_paid: true,
      },
    });

    const config = await this.databaseService.config.findMany();

    const bot = new Telegraf(token as string);

    bot.telegram.sendMessage(
      user.telegram_id,
      'Click on  the link below to gain access to the gibchain academy \n' +
        '\n' +
        '<a href="' +
        config[0].group_link +
        '">Gibchain academy</a> ' +
        '\n' +
        '\n' +
        "if clicking link above doesn't work you can copy the link below and paste it in your browser" +
        '\n' +
        '\n' +
        config[0].group_link +
        '\n' +
        '\n' +
        'Do  not share this link with anyone' +
        '\n' +
        'Thank you',
      {
        parse_mode: 'HTML',
      },
    );
  }
}
