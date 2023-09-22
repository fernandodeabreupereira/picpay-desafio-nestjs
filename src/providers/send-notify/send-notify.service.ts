import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { IProvider } from '../../interfaces/provider';

@Injectable()
export class SendNotifyService implements IProvider {
  async execute (): Promise<string> {
    try {
      const response = await axios.get('https://run.mocky.io/v3/5f4d543f-219f-43c8-8d2f-de90ff6d769c');
      return response.data.message;
    } catch (error) {
      return error.response.data.errors[0];
    }
  }
}