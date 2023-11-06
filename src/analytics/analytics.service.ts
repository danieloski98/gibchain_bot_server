import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AnalyticsService {
  constructor(private databaseService: DatabaseService) {}

  public async getAnalytics() {
    const withdrawals =
      await this.databaseService.widthdrawal_request.findMany();
    const totalUsers = await this.databaseService.user.findMany({});
    const totalPendingUsers = await this.databaseService.user.findMany({
      where: { has_paid: false },
    });
    const totalApprovedUsers = await this.databaseService.user.findMany({
      where: { has_paid: true },
    });
    const pendingWithdrawals =
      await this.databaseService.widthdrawal_request.findMany({
        where: {
          approved: true,
        },
      });

    return {
      message: 'anayltics',
      data: {
        totalUsers,
        withdrawals,
        totalPendingUsers,
        totalApprovedUsers,
        totalPendingWithdrawals: pendingWithdrawals,
      },
    };
  }
}
