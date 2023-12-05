/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { CreateAccountDTO } from 'src/auth/DTO/CreateAccountDTO';
import { DatabaseService } from 'src/database/database.service';
import { BadRequestException } from '@nestjs/common';
import { EmailServiceService } from 'src/email-service/email-service.service';
import { randomInt } from 'crypto';
import { VerifyCodeDTO } from 'src/auth/DTO/VerifyCodeDTO';
import { HttpService } from '@nestjs/axios';
require('dotenv').config();
//const TelegramBot = require('node-telegram-bot-api');
import { Telegraf } from 'telegraf';
import { toFile } from 'qrcode';

const token = process.env.TELEGRAM_API_KEY;

@Injectable()
export class UserService {
  constructor(
    private databaseService: DatabaseService,
    private EmailService: EmailServiceService,
    private httpService: HttpService,
  ) {}

  async createUserAccount(payload: CreateAccountDTO) {
    console.log(payload);
    const user = await this.databaseService.user.findFirst({
      where: {
        OR: [
          { telegram_id: payload.telegram_id },
          { email: payload.email },
          { phone: payload.phone },
        ],
      },
    });

    if (user !== null) {
      throw new BadRequestException(
        'Account already existt with either email or phone number',
      );
    }

    // create user account
    if (payload.referral && payload.referral === payload.telegram_id) {
      delete payload.referral;
    }

    const newUser = await this.databaseService.user.create({
      data: {
        ...payload,
      },
    });

    if (payload.referral) {
      console.log(payload);
      await this.databaseService.referrals.create({
        data: {
          referral_id: payload.referral,
          referredUserId: newUser.id,
        },
      });
    }

    // create code
    const randomcode = randomInt(9999);
    const newCode = await this.databaseService.code.create({
      data: {
        user_id: newUser.id,
        code: randomcode,
        type: 'VERIFICATION',
      },
    });
    const timeoout = setTimeout(async () => {
      await this.databaseService.code.update({
        where: { id: newCode.id },
        data: { expired: true },
      });
      clearTimeout(timeoout);
    }, 60 * 1000);
    // send email
    const emailRequest = await this.EmailService.sendConfirmationEmail({
      message: randomcode.toString(),
      email: payload.email,
    });

    return {
      message: 'Acccount created successfully',
      statusCode: 200,
      data: emailRequest,
    };
  }

  async resendVerificationCode(telegram_id: string) {
    const user = await this.databaseService.user.findFirst({
      where: {
        telegram_id,
      },
    });

    if (user === null) {
      throw new BadRequestException('User does not exist');
    }

    const hasCode = await this.databaseService.code.findFirst({
      where: {
        user_id: user.id,
      },
    });

    if (hasCode) {
      await this.databaseService.code.updateMany({
        where: { user_id: user.id },
        data: { expired: true },
      });
    }

    // create code
    const randomcode = randomInt(9999);
    const newCode = await this.databaseService.code.create({
      data: {
        user_id: user.id,
        code: randomcode,
        type: 'VERIFICATION',
      },
    });
    const timeoout = setTimeout(async () => {
      await this.databaseService.code.update({
        where: { id: newCode.id },
        data: { expired: true },
      });
      clearTimeout(timeoout);
    }, 60 * 1000);
    // send email
    const emailRequest = await this.EmailService.sendConfirmationEmail({
      message: randomcode.toString(),
      email: user.email,
    });

    return {
      message: 'Email Sent!',
      statusCode: 200,
      data: emailRequest,
    };
  }

  public async validateCode(payload: VerifyCodeDTO) {
    const user = await this.databaseService.user.findFirst({
      where: {
        telegram_id: payload.telegram_id,
      },
    });

    if (user === null) {
      throw new BadRequestException('User does not exist');
    }

    const code = await this.databaseService.code.findFirst({
      where: {
        code: payload.code,
      },
    });

    if (
      code === null ||
      code.expired ||
      code.user_id !== user.id ||
      code.type !== 'VERIFICATION'
    ) {
      throw new BadRequestException('Invalid code');
    }

    await this.databaseService.code.update({
      where: { id: code.id },
      data: { expired: true },
    });

    await this.databaseService.user.update({
      where: { id: user.id },
      data: {
        email_verified: true,
      },
    });

    const bot = new Telegraf(token as string);

    const options = {
      errorCorrectionLevel: 'H', // Error correction level (L, M, Q, H)
      type: 'png', // Output image type (png, svg, pdf, terminal)
      quality: 0.92, // Image quality (only for png and jpeg types)
      margin: 1, // Margin around the QR code (default is 4 for png, 1 for others)
    };

    console.log(toFile);
    const config = await this.databaseService.config.findMany();
    const details = config[0];

    // generate qrcode
    toFile(
      './code.png',
      details.wallet_address as any,
      options as any,
      (err) => {
        if (err) {
          console.log(err);
        } else {
          bot.telegram.sendPhoto(
            user.telegram_id,
            { source: './code.png' },
            {
              caption:
                `To pay for access to the class scan the code above and send *${details.fee} ${details.currency} ${details.network}*` +
                '\n' +
                '\n' +
                "If the code doesn't work for you copy the address below" +
                '\n' +
                '\n' +
                'ADDRESS ' +
                '\n' +
                '\n' +
                details.wallet_address +
                '\n' +
                '\n' +
                `NETWORK ${details.network} ` +
                '\n' +
                '\n' +
                'After payment, send your proof of payment to this whatsapp number' +
                '\n' +
                `[whatsapp link](${process.env.WHATSAPP_GROUP})`,
              parse_mode: 'MarkdownV2',
            },
          );
        }
      },
    );

    // bot.telegram.sendMessage(
    //   user.telegram_id,
    //   'Your email' +
    //     ' ' +
    //     user.email +
    //     'has been verified' +
    //     '\n' +
    //     'To pay for access to the gibchain academy follow this link ',
    //   {
    //     reply_markup: {
    //       inline_keyboard: [
    //         [
    //           {
    //             text: '💰 ACCESS CLASS',
    //             url: 'https://commerce.coinbase.com/checkout/d91a310f-29d7-497a-b4eb-b420d47ea81b',
    //           },
    //         ],
    //       ],
    //     },
    //   },
    // );

    return {
      message: 'Email verified',
      statusCode: 200,
    };
  }
}
