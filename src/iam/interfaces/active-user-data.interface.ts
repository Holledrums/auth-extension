import { Request } from 'express';
import { Role } from '../../users/enums/role.enum';
import { PermissionType } from '../authorization/permission.type';
import { REQUEST_USER_KEY } from '../constants/iam.constants';

export interface ActiveUserData {
  /**
   * The "subject" of the token. The value of this property is the user ID
   * that granted this token.
   */
  sub: number;

  /**
   * The subject's (user) email.
   */
  email: string;

  /**
   * The subject's (user) role.
   */
  role: Role;
  // /**
  //  * The subject's (user) permissions.
  //  */
  permissions: PermissionType[];
}
export interface RequestWithUser extends Request {
  [REQUEST_USER_KEY]: ActiveUserData;
}
