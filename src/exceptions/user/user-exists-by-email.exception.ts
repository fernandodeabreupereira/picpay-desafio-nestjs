import { HttpException } from '@nestjs/common';

export const emailExceptionMessage =
  'Um usuário já está cadastrado com esse e-mail.';

export class UserExistsByEmailException extends HttpException {
  constructor () {
    super(emailExceptionMessage, 400);
  }
}