import { Injectable } from '@nestjs/common';
import { IReturnLoggedInUser } from '../../../../interfaces/return-logged-in-user';
import { IService } from '../../../../interfaces/service';
import { UserRepository } from '../../../../repositories/abstracts/user.repository';
import { InvalidUserByIdException } from '../../../../exceptions/user/user-exists-by-id.exception';

@Injectable()
export class LoggedInUserService implements IService {
  constructor (private readonly _meUserRepository: UserRepository) { }

  async execute (token_user_id: string): Promise<IReturnLoggedInUser> {
    const user = await this._meUserRepository.findById(token_user_id);

    if (!user) {
      throw new InvalidUserByIdException();
    }

    const meUser: IReturnLoggedInUser = {
      role: user.role,
      full_name: user.full_name,
      email: user.email,
      balance: user.balance,
    };

    return meUser;
  }
}