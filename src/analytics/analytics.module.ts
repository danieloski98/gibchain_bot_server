import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, DatabaseService],
})
export class AnalyticsModule {}
