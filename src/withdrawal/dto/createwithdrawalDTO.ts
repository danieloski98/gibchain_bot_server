import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class WithdrawalDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Expose()
  telegram_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Expose()
  wallet_address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Expose()
  network: string;
}
