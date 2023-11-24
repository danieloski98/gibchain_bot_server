import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [ConfigController],
  providers: [ConfigService, DatabaseService],
})
export class ConfigModule {}
