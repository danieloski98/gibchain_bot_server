import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@Exclude()
export class CreateAccountDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  telegram_username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  telegram_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  phone: string;

  @ApiProperty()
  @IsString()
  @Expose()
  @IsOptional()
  referral: string;
}
