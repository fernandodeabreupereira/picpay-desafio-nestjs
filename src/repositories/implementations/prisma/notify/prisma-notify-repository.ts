import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-client.service';
import { INotify } from './../../../../models/notify';
import { NotifyRepository } from './../../../../repositories/abstracts/notify.repository';

@Injectable()
export class PrismaNotifyRepository implements NotifyRepository {
  constructor (private readonly _prismaService: PrismaService) { }

  async send (data: INotify): Promise<void> {
    await this._prismaService.notify.create({
      data,
    });
  }
}