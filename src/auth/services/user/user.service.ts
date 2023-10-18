import { Injectable } from '@nestjs/common';
import { CreateAccountDTO } from 'src/auth/DTO/CreateAccountDTO';
import { DatabaseService } from 'src/database/database.service';
import { BadRequestException } from '@nestjs/common';
import { EmailServiceService } from 'src/email-service/email-service.service';
import { randomInt } from 'crypto';
import { VerifyCodeDTO } from 'src/auth/DTO/VerifyCodeDTO';

@Injectable()
export class UserService {
  constructor(
    private databaseService: DatabaseService,
    private EmailService: EmailServiceService,
  ) {}

  async createUserAccount(payload: CreateAccountDTO) {
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
      throw new BadRequestException('User already exists');
    }

    // create user account
    if (payload.referral === payload.telegram_id) {
      delete payload.referral;
    }

    const newUser = await this.databaseService.user.create({
      data: {
        ...payload,
      },
    });

    if (payload.referral) {
      await this.databaseService.referrals.create({
        data: {
          telegram_id: payload.referral,
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
    const now = new Date();
    const min = now.setMinutes(now.getMinutes() + 5);
    const timeoout = setTimeout(async () => {
      await this.databaseService.code.update({
        where: { id: newCode.id },
        data: { expired: true },
      });
      clearTimeout(timeoout);
    }, min);
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
    const now = new Date();
    const min = now.setMinutes(now.getMinutes() + 5);
    const timeoout = setTimeout(async () => {
      await this.databaseService.code.update({
        where: { id: newCode.id },
        data: { expired: true },
      });
      clearTimeout(timeoout);
    }, min);
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

    return {
      message: 'Email verified',
      statusCode: 200,
    };
  }
}
