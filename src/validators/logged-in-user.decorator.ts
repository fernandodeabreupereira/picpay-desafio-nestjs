import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IReturnUser } from 'src/interfaces/return-user';
import { IAuthRequest } from 'src/types/auth.request';

export const LoggedInUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): IReturnUser => {
    const request = context.switchToHttp().getRequest<IAuthRequest>();
    return request.user;
  },
);