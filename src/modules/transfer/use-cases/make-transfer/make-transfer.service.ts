import { Injectable } from '@nestjs/common';
import { InsufficientBalanceException } from '../../../../exceptions/transfer/insufficient-balance.exception';
import { InvalidEmailTransferException } from '../../../../exceptions/transfer/invalid-email-transfer.exception';
import { TransferErrorException } from '../../../../exceptions/transfer/transfer-error.exception';
import { TransferToOwnEmailException } from '../../../../exceptions/transfer/transfer-to-own-email.exception';
import { UnauthorizedRoleTransferException } from '../../../../exceptions/transfer/unauthorized-role-transfer.exception';
import { InvalidUserByIdException } from '../../../../exceptions/user/user-exists-by-id.exception';
import { IService } from '../../../../interfaces/service';
import { ITransfer } from '../../../../models/transfer';
import { SendNotifyService, exceededMonthlyRequestQuotaErrorMessage } from '../../../../providers/send-notify/send-notify.service';
import { TransferAuthorizerService } from '../../../../providers/transfer-authorizer/transfer-authorizer.service';
import { NotifyRepository } from '../../../../repositories/abstracts/notify.repository';
import { TransferRepository } from '../../../../repositories/abstracts/transfer.repository';
import { UserRepository } from '../../../../repositories/abstracts/user.repository';

@Injectable()
export class MakeTransferService implements IService {

  constructor (
    private readonly _makeTransferRepository: TransferRepository,
    private readonly _userRepository: UserRepository,
    private readonly _notifyRepository: NotifyRepository,
    private readonly _transferAuthorizerService: TransferAuthorizerService,
    private readonly _sendNotifyService: SendNotifyService,
  ) { }

  async execute (data: ITransfer): Promise<string> {
    const user = await this._userRepository.findById(data.account_id);

    if (!user) {
      throw new InvalidUserByIdException();
    }

    if (user.role == 'seller') {
      throw new UnauthorizedRoleTransferException();
    }

    const isValidReceiver = await this._userRepository.findByEmail(data.to_user_email);

    if (!isValidReceiver) {
      throw new InvalidEmailTransferException();
    }

    if (data.to_user_email == user.email) {
      throw new TransferToOwnEmailException();
    }

    // Processo de transferência

    if (user.balance === 0 || user.balance < 0) {
      throw new InsufficientBalanceException();
    }

    const balanceAfterTransfer = user.balance - data.value;

    if (balanceAfterTransfer < 0) {
      throw new InsufficientBalanceException();
    }

    try {
      const isAuthorized = await this._transferAuthorizerService.execute();

      if (isAuthorized !== 'Autorizado') {
        throw new Error();
      }

      await this._makeTransferRepository.transfer(data);

      await this._notifyRepository.send({
        payer_name: user.full_name,
        payer_cpf: user.cpf,
        to_user_id: isValidReceiver.id,
        transfer_amount: data.value,
        transfer_time: new Date()
      });

      const notificationSent = await this._sendNotifyService.execute();

      if (notificationSent !== 'Success' && notificationSent !== exceededMonthlyRequestQuotaErrorMessage) {
        throw new Error();
      }
    } catch (error) {
      throw new TransferErrorException();
    }

    return `Transferência realizada com sucesso para ${data.to_user_email} no valor de R$${data.value}.`;
  }
}
