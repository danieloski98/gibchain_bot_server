import { HttpService } from '@nestjs/axios';
import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

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
          price_amount: 20,
          price_currency: 'usd',
          pay_currency: 'usdt',
          success_url: `${process.env.LOCAL_URL}/pay?id=${user.id}`,
          order_description: 'Payment for gibchain academy access',
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

    return {
      message: 'Account approved',
      statusCode: 200,
    };
  }
}
