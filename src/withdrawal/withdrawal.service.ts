import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { WithdrawalDTO } from './dto/createwithdrawalDTO';

@Injectable()
export class WithdrawalService {
  constructor(private databaseservice: DatabaseService) {}

  public async getAllWithdrrawals() {
    const withdrawal =
      await this.databaseservice.widthdrawal_request.findMany();
    return {
      data: {
        withdrawals: withdrawal,
      },
    };
  }

  public async getAllPendingWithdrrawals() {
    const withdrawal = await this.databaseservice.widthdrawal_request.findMany({
      where: {
        approved: false,
      },
    });
    return {
      data: {
        withdrawals: withdrawal,
      },
    };
  }
  public async getAvaliableWidthdrawal(telegram_id: string) {
    const user = await this.databaseservice.user.findFirst({
      where: {
        telegram_id,
      },
    });

    if (user === null) {
      throw new BadRequestException('User not found');
    }

    // get all withdrawals that have been approved,
    const referrals = await this.databaseservice.user.findMany({
      where: {
        referral: user.telegram_id,
        has_paid: true,
      },
    });

    const withdrawals = await this.databaseservice.widthdrawal_request.findMany(
      {
        where: {
          user_id: user.id,
        },
      },
    );

    return {
      message: 'details',
      data: {
        referrals,
        withdrawals,
      },
    };
  }

  public async createWithdrawal(payload: WithdrawalDTO) {
    console.log(payload);
    const user = await this.databaseservice.user.findFirst({
      where: {
        telegram_id: payload.telegram_id,
      },
    });

    const withdrawal = await this.databaseservice.widthdrawal_request.findFirst(
      {
        where: {
          user_id: user.id,
          approved: false,
        },
      },
    );

    if (withdrawal !== null) {
      throw new BadRequestException('You have a pending withdrawal request');
    }

    const withdrawals = await this.databaseservice.widthdrawal_request.findMany(
      {
        where: {
          approved: true,
          user_id: user.id,
        },
      },
    );

    const referrals = await this.databaseservice.user.findMany({
      where: {
        referral: user.telegram_id,
        has_paid: true,
      },
    });

    const totalWithdrawals =
      withdrawals.length < 1
        ? 0
        : withdrawals.reduce((total, withdrawal) => {
            return total + withdrawal.amount;
          }, 0);

    if (referrals.length < 1) {
      throw new BadRequestException('You do not have any referral');
    }

    // calculate
    const totalReferrals = referrals.length * 2;
    if (totalReferrals - totalWithdrawals === 0) {
      throw new BadRequestException(
        'you cannot make any withdrawals as you do not have enough points',
      );
    }

    // create withdrawal
    await this.databaseservice.widthdrawal_request.create({
      data: {
        amount: totalReferrals - totalWithdrawals,
        network: payload.network,
        wallet_address: payload.wallet_address,
        user_id: user.id,
      },
    });

    return {
      message: 'Your withdrawal request has been made',
    };
  }

  public async approveWithdrawal({
    transaction_id,
  }: {
    transaction_id: string;
  }) {
    const withdrawal =
      await this.databaseservice.widthdrawal_request.findUnique({
        where: {
          id: transaction_id,
        },
      });

    if (withdrawal.approved === null) {
      throw new BadRequestException('transaction does not exist');
    }

    if (withdrawal.approved) {
      throw new BadRequestException('This withdrawal has been approved');
    }

    await this.databaseservice.widthdrawal_request.update({
      where: {
        id: transaction_id,
      },
      data: {
        approved: true,
        approved_by: 'ADMIN',
      },
    });

    return {
      message: 'Approved',
    };
  }
}
