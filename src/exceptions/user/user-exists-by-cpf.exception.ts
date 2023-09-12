import { HttpException } from '@nestjs/common';

export const cpfExceptionMessage =
  'Um usuário já está cadastrado com esse CPF.';

export class UserExistsByCpfException extends HttpException {
  constructor () {
    super(cpfExceptionMessage, 400);
  }
}