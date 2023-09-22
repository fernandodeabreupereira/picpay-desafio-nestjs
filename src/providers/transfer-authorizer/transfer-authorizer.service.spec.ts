import axios from "axios";
import { TransferAuthorizerService } from "./transfer-authorizer.service";

describe('TransferAuthorizerService', () => {
  let transferAuthorizerService: TransferAuthorizerService;

  beforeEach(() => {
    transferAuthorizerService = new TransferAuthorizerService();

    jest.spyOn(axios, 'get');
  });

  it('should be defined', () => {
    expect(transferAuthorizerService).toBeDefined();
  });

  it('should return a message from the authorizer API', async () => {
    const response = await transferAuthorizerService.execute();

    expect(axios.get).toHaveBeenCalledWith(
      'https://run.mocky.io/v3/385d15f0-29a8-474e-a575-a776fdd2e400',
    );

    expect(typeof response).toBe('string');
  });

});