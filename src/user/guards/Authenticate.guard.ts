import { CanActivate, ExecutionContext, UseGuards } from '@nestjs/common';

export function Authenticate() {
  return UseGuards(AuthenticateGuard);
}

export class AuthenticateGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const isHttp = context.getType() === 'http';
    if (!isHttp) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    return req.session.userId;
  }
}
