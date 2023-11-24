import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ConfigDTO {
  @ApiProperty()
  @IsNumber()
  fee: number;
}
