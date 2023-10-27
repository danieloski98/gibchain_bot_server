import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AdminAuthorizationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    console.log(context);
    return true;
  }
}
