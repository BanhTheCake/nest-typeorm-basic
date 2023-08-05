import { CanActivate, ExecutionContext, UseGuards } from '@nestjs/common';

export function Authorize() {
  return UseGuards(AuthorizeGuard);
}

export class AuthorizeGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const isHttp = context.getType() === 'http';
    if (!isHttp) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    return req.currentUser.isAdmin;
  }
}
