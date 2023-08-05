import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const isHttp = ctx.getType() === 'http';
    if (!isHttp) {
      return null;
    }
    const request = ctx.switchToHttp().getRequest();
    return request.currentUser;
  },
);
