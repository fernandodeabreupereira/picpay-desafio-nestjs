import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InvalidLoginException } from '../../../exceptions/auth/invalid-login.exception';
import { IReturnUser } from 'src/interfaces/return-user';
import { UserRepository } from '../../../repositories/abstracts/user.repository';

interface IAuthService {
  validateUser (email: string, password: string): Promise<IReturnUser>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor (private readonly _authUserRepository: UserRepository) { }

  async validateUser (email: string, password: string): Promise<IReturnUser> {
    const user = await this._authUserRepository.findByEmail(email);

    if (!user) {
      throw new InvalidLoginException();
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new InvalidLoginException();
    }

    const { password: _, ...returnUser } = user

    return returnUser as IReturnUser;
  }
}