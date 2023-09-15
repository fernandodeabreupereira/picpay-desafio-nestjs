import { Injectable } from '@nestjs/common';
import { ITransfer } from '../../../models/transfer';
import { TransferRepository } from '../../../repositories/abstracts/transfer.repository';

interface IUserTest {
  readonly id?: string;
  readonly role: 'user' | 'seller';
  readonly full_name: string;
  readonly cpf: string;
  readonly email: string;
  readonly password: string;
  balance?: number;
}

@Injectable()
export class TransferRepositorySQLInMemory implements TransferRepository {
  async transfer (data: ITransfer): Promise<void> {
    const payerUsers: IUserTest[] = [
      {
        id: data.account_id,
        role: 'user',
        full_name: 'Payer',
        cpf: '08601711081',
        email: 'payer@gmail.com',
        password: 'payer123',
        balance: 100,
      },
    ];

    const receiverUsers: IUserTest[] = [
      {
        id: 'receiver_id',
        role: 'seller',
        full_name: 'Receiver',
        cpf: '80676284086',
        email: data.to_user_email,
        password: 'receiver123',
        balance: 50,
      },
    ];

    payerUsers.find((user) => user.id === data.account_id).balance -=
      data.value;

    receiverUsers.find(
      (user) => user.email === data.to_user_email,
    ).balance += data.value;
  }
}