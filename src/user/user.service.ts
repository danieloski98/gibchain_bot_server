// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  public async checkUserAccount(telegram_id: string) {
    const user = await this.databaseService.user.findFirst({
      where: {
        telegram_id,
      },
    });

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
        telegram_id,
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
      
    });
    return {
      message: 'users',
      data: users,
      statusCode: 200,
    }
  }

  public async getUserById(userId: string) {
    const user = await this.databaseService.user.findFirst({
      where: { id: userId },
      include: {
        referrals: true,
        Widthdrawal_request: true,
      }
    });

    return {
      message: 'user',
      data: user,
      statusCode: 200,
    }
  }
}
