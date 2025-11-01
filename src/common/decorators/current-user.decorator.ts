import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '../types/user-palyload.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest<{ user: UserPayload }>();
    return request.user;
  },
);
