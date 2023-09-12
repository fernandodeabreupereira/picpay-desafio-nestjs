export const invalidLoginExceptionMessage = 'Email ou senha incorreto(s).';

export class InvalidLoginException extends Error {
  constructor () {
    super(invalidLoginExceptionMessage);
  }
}