import { HttpException } from '@nestjs/common';

export const insufficientBalanceExceptionMessage =
  'Você não tem saldo disponível para efetuar a transferência.';

export class InsufficientBalanceException extends HttpException {
  constructor () {
    super(insufficientBalanceExceptionMessage, 402);
  }
}