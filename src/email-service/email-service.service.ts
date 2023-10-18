// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailServiceService {
  private resend: Resend = new Resend(process.env.RESEND_API_KEY);

  public async sendConfirmationEmail({
    message,
    email,
  }: {
    message: string;
    email: string;
  }) {
    try {
      const data: any = await this.resend.emails.send({
        from: 'support@support.gibchainacademy.com',
        to: [email],
        subject: 'Email verification code',
        html: `Your verification code is ${message}`,
      });

      console.log(data);
      return {
        message: data?.message || 'Verification code sent to your email',
        statusCode: data.statusCode || 200,
        data,
      };
    } catch (error: any) {
      return {
        message: error.message,
        statusCode: 400,
      };
    }
  }
}
