import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './services/user/user.service';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateAccountDTO } from './DTO/CreateAccountDTO';
import { VerifyCodeDTO } from './DTO/VerifyCodeDTO';

@ApiTags('AUTHENTICATION')
@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @ApiBody({ type: CreateAccountDTO })
  @Post('user/create-account')
  createUserAccount(@Body() body: CreateAccountDTO) {
    return this.userService.createUserAccount(body);
  }

  @ApiParam({ name: 'telegram_id', type: String })
  @Get('user/resend-verification-code/:telegram_id')
  resendCode(@Param('telegram_id') param: string) {
    return this.userService.resendVerificationCode(param);
  }

  @ApiBody({ type: VerifyCodeDTO })
  @Post('user/verify-code')
  verifyCode(@Body() body: VerifyCodeDTO) {
    return this.userService.validateCode(body);
  }
}
