import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ConfigDTO {
  @ApiProperty()
  @IsNumber()
  fee: number;

  @ApiProperty()
  @IsString()
  wallet_address: string;

  @ApiProperty()
  @IsString()
  network: string;

  @ApiProperty()
  @IsString()
  currency: string;
}
