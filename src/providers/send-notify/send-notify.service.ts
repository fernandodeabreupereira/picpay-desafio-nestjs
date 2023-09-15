import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { IProvider } from '../../interfaces/provider';

export const exceededMonthlyRequestQuotaErrorMessage =
  'Monthly request quota has been exceeded. Visit https://app.mocklab.io/account/subscriptions to upgrade.';

@Injectable()
export class SendNotifyService implements IProvider {
  async execute (): Promise<string> {
    try {
      const response = await axios.get('http://o4d9z.mocklab.io/notify');
      return response.data.message;
    } catch (error) {
      return error.response.data.errors[0];
    }
  }
}