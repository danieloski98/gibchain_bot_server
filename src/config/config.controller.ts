import { Body, Controller, Get, Put } from '@nestjs/common';
import { ConfigDTO } from './DTO/Config.dto';
import { ConfigService } from './config.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CONFIG')
@Controller('config')
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Put()
  editConfig(@Body() body: ConfigDTO) {
    return this.configService.updateConfig(body);
  }

  @Get()
  getconfig() {
    return this.configService.getConfig();
  }
}
