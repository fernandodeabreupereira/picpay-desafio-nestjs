import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { cpf } from 'cpf-cnpj-validator';
import { UserExistsByCpfException } from '../../../exceptions/user/user-exists-by-cpf.exception';
import { UserExistsByEmailException } from '../../../exceptions/user/user-exists-by-email.exception';
import { IReturnUser } from 'src/interfaces/return-user';
import { IService } from 'src/interfaces/service';
import { IUser } from 'src/models/user';
import { UserRepository } from '../../../repositories/abstracts/user.repository';

@Injectable()
export class CreateUserService implements IService {
  constructor (private readonly _createUserRepository: UserRepository) { }

  async execute (data: IUser): Promise<IReturnUser> {
    const formattedCPF = cpf.strip(data.cpf);

    const findUserByCPF = await this._createUserRepository.findByCPF(
      formattedCPF,
    );

    if (findUserByCPF) {
      throw new UserExistsByCpfException();
    }

    const findUserByEmail = await this._createUserRepository.findByEmail(
      data.email,
    );

    if (findUserByEmail) {
      throw new UserExistsByEmailException();
    }

    const createUser = await this._createUserRepository.create({
      ...data,
      cpf: formattedCPF,
      password: await bcrypt.hash(data.password, 10),
      balance: 0,
    });

    const returnToBody: IReturnUser = {
      role: createUser.role,
      full_name: createUser.full_name,
      email: createUser.email,
    };

    return returnToBody;
  }
}
