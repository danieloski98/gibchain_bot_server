import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Exclude()
export class VerifyCodeDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  telegram_id: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  code: number;
}
