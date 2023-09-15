import { Injectable } from '@nestjs/common';
import { INotify } from '../../../models/notify';
import { NotifyRepository } from '../../../repositories/abstracts/notify.repository';

@Injectable()
export class NotifyRepositorySQLInMemory implements NotifyRepository {
  private notifications: INotify[] = [];

  async send (data: INotify): Promise<void> {
    this.notifications.push(data);
  }
}