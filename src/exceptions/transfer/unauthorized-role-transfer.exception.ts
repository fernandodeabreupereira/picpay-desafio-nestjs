import { HttpException } from '@nestjs/common';

export const unauthorizedRoleTransferExceptionMessage =
  'Não é possível realizar transferências de usuários lojistas.';

export class UnauthorizedRoleTransferException extends HttpException {
  constructor () {
    super(unauthorizedRoleTransferExceptionMessage, 401);
  }
}