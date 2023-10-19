import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@Exclude()
export class CreateAdminAccountDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Expose()
  password: string;
}
