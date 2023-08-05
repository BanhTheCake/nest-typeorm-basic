import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private readonly userService: UserService) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    const isHttp = context.getType() === 'http';
    if (!isHttp) {
      return next.handle();
    }
    const req = context.switchToHttp().getRequest();
    const userId = req.session?.userId;
    const user = await this.userService.findOne({ id: userId });
    req.currentUser = user;
    return next.handle();
  }
}
