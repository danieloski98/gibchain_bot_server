import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ConfigDTO } from './DTO/Config.dto';

@Injectable()
export class ConfigService {
  constructor(private databaseService: DatabaseService) {}

  public async updateConfig(payload: ConfigDTO) {
    const config = await this.databaseService.config.findMany();
    if (config.length > 0) {
      await this.databaseService.config.updateMany({
        data: {
          ...payload,
        },
      });

      return {
        message: 'Updated',
      };
    } else {
      await this.databaseService.config.create({
        data: {
          ...payload,
        },
      });
      return {
        message: 'Created',
      };
    }
  }

  public async getConfig() {
    const config = await this.databaseService.config.findMany();

    if (config.length < 1) {
      const create = await this.databaseService.config.create({
        data: {
          fee: 22,
        },
      });
      return {
        message: 'config',
        data: create,
      };
    } else {
      return {
        message: 'config',
        data: config[0],
      };
    }
  }
}
