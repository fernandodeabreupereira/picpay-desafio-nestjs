import { HttpException } from '@nestjs/common';

export const transferToOwnEmailExceptionMessage =
  'Não é possível efetuar uma transferência para sua própria conta.';

export class TransferToOwnEmailException extends HttpException {
  constructor () {
    super(transferToOwnEmailExceptionMessage, 400);
  }
}