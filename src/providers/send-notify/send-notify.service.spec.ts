import axios from "axios";
import { SendNotifyService } from "./send-notify.service";

describe('SendNotifyService', () => {
  let sendNotifyService: SendNotifyService;

  beforeEach(() => {
    sendNotifyService = new SendNotifyService();

    jest.spyOn(axios, 'get');
  });

  it('should be defined', () => {
    expect(sendNotifyService).toBeDefined();
  });

  it('should return a message from the notify API', async () => {
    const response = await sendNotifyService.execute();

    expect(axios.get).toHaveBeenCalledWith('https://run.mocky.io/v3/5f4d543f-219f-43c8-8d2f-de90ff6d769c');
    expect(typeof response).toBe('string');
  }, 30000);
});