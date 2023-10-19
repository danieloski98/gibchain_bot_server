/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpService } from '@nestjs/axios';
import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

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

    const bot = new TelegramBot(token as string, { polling: true });

    bot.sendMessage(
      user.telegram_id,
      'Click on  the link below to gain access to the gibchain academy \n' +
        '\n' +
        '<a href="' +
        process.env.GROUP_LINK +
        '">Gibchain academy</a> ' +
        '\n' +
        '\n' +
        "if clicking link above doesn't work you can copy the link below and paste it in your browser" +
        '\n' +
        '\n' +
        process.env.GROUP_LINK +
        '\n' +
        '\n' +
        'Do  not share this link with anyone' +
        '\n' +
        'Thank you',
      {
        parse_mode: 'HTML',
      },
    );

    return {
      message: 'Account approved',
      statusCode: 200,
    };
  }
}
