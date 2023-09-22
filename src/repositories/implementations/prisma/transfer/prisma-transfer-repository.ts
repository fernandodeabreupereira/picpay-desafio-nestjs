import { Injectable } from '@nestjs/common';
import { ITransfer } from '../../../../models/transfer';
import { TransferRepository } from '../../../abstracts/transfer.repository';
import { PrismaService } from '../prisma-client.service';

@Injectable()
export class PrismaTransferRepository implements TransferRepository {
  constructor (private readonly _prismaService: PrismaService) { }

  async transfer (data: ITransfer): Promise<void> {
    await this._prismaService.user.update({
      where: { id: data.account_id },
      data: { balance: { decrement: parseFloat(data.value.toFixed(2)) } },
    });

    await this._prismaService.user.update({
      where: { email: data.to_user_email },
      data: { balance: { increment: parseFloat(data.value.toFixed(2)) } },
    });
  }
}