import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import {
  ActiveUserData,
  RequestWithUser,
} from '../interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '../constants/iam.constants';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user: ActiveUserData | undefined = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);
