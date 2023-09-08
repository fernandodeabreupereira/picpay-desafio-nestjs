import { Request } from 'express';
import { IReturnUser } from 'src/interfaces/return-user';

export interface IAuthRequest extends Request {
  user: IReturnUser;
}