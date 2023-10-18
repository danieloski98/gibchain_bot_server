import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from './services/user/user.service';
import { AdminService } from './services/admin/admin.service';
import { DatabaseService } from 'src/database/database.service';
import { EmailServiceService } from 'src/email-service/email-service.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [AuthController],
  providers: [UserService, AdminService, DatabaseService, EmailServiceService],
  imports: [HttpModule],
})
export class AuthModule {}
