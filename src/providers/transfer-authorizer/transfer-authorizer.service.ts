import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { IProvider } from '../../interfaces/provider';

@Injectable()
export class TransferAuthorizerService implements IProvider {
  async execute (): Promise<string> {
    const response = await axios.get('https://run.mocky.io/v3/385d15f0-29a8-474e-a575-a776fdd2e400');
    return response.data.message;
  }
}