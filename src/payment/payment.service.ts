/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpService } from '@nestjs/axios';
import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
require('dotenv').config();
import { Telegraf } from 'telegraf';
const token = process.env.TELEGRAM_API_KEY;

@Injectable()
export class PaymentService {
  constructor(
    private databaseService: DatabaseService,
    private httpService: HttpService,
  ) {}

  public async generatePaymentLink(telegram_id: string) {
    const user = await this.databaseService.user.findFirst({
      where: { telegram_id },
    });

    if (user === null) {
      throw new BadRequestException('User not found');
    }

    if (user.has_paid) {
      throw new BadRequestException('You have already paid for this course');
    }
    try {
      const request = await this.httpService.axiosRef.post(
        'https://api.nowpayments.io/v1/invoice',
        {
          price_amount: 23.2,
          price_currency: 'usd',
          pay_currency: 'usdttrc20',
          success_url: `${process.env.LOCAL_URL}/pay?user_id=${user.id}`,
          cancel_url: `${process.env.LOCAL_URL}`,
          order_description: 'Payment for gibchain academy access',
          is_fixed_rate: false,
          is_fee_paid_by_user: false,
        },
        {
          headers: {
            'x-api-key': process.env.NOW_PAYMENT_API_KEY,
          },
        },
      );

      console.log(request.data);

      return {
        message: 'link generated',
        data: request.data,
        statusCode: 200,
      };
    } catch (error: any) {
      console.log(error);
      throw new BadRequestException({
        message: error.response.data.message,
        statusCode: 400,
        data: error,
      });
    }
  }

  public async activateAccount(userId: string) {
    const user = await this.databaseService.user.findFirst({
      where: { id: userId },
    });

    if (user === null) {
      throw new BadRequestException('User not found');
    }

    if (user.has_paid) {
      throw new BadRequestException('You have already paid for this course');
    }

    await this.databaseService.user.update({
      where: { id: userId },
      data: { has_paid: true },
    });

    const config = await this.databaseService.config.findMany();

    const bot = new Telegraf(token as string);

    bot.telegram.sendMessage(
      user.telegram_id,
      'Your payment was successful, you can now proceed to join the group' +
        '\n' +
        'Click on  the link below to gain access to gibchain academy \n',
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '👥 Join Group',
                url: config[0].group_link,
              },
            ],
          ],
        },
      },
    );

    return {
      message: 'Account approved',
      statusCode: 200,
    };
  }

  public async widthdrawa(telegram_id: string) {
    const user = await this.databaseService.user.findFirst({
      where: {
        telegram_id,
      },
      include: {
        referrals: true,
      },
    });

    if (user === null) {
      throw new BadRequestException('Userr not foound');
    }

    // await this.databaseService.widthdrawal_request.create({
    //   data: {
    //     network: 'trc20',

    //     wallet_address: '',
    //   }
    // });
  }
}
