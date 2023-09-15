import { HttpException } from '@nestjs/common';

export const invalidEmailTransferExceptionMessage =
  'E-mail do recebedor da transferência inválido.';

export class InvalidEmailTransferException extends HttpException {
  constructor () {
    super(invalidEmailTransferExceptionMessage, 400);
  }
}