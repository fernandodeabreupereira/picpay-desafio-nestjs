import { Test, TestingModule } from '@nestjs/testing';
import { InsufficientBalanceException } from '../../../../exceptions/transfer/insufficient-balance.exception';
import { InvalidEmailTransferException } from '../../../../exceptions/transfer/invalid-email-transfer.exception';
import { TransferErrorException } from '../../../../exceptions/transfer/transfer-error.exception';
import { TransferToOwnEmailException } from '../../../../exceptions/transfer/transfer-to-own-email.exception';
import { UnauthorizedRoleTransferException } from '../../../../exceptions/transfer/unauthorized-role-transfer.exception';
import { InvalidUserByIdException } from '../../../../exceptions/user/user-exists-by-id.exception';
import { INotify } from '../../../../models/notify';
import { ITransfer } from '../../../../models/transfer';
import { IUser } from '../../../../models/user';
import { SendNotifyService } from '../../../../providers/send-notify/send-notify.service';
import { TransferAuthorizerService } from '../../../../providers/transfer-authorizer/transfer-authorizer.service';
import { NotifyRepository } from '../../../../repositories/abstracts/notify.repository';
import { TransferRepository } from '../../../../repositories/abstracts/transfer.repository';
import { UserRepository } from '../../../../repositories/abstracts/user.repository';
import { MakeTransferService } from './make-transfer.service';

describe('MakeTransferService', () => {
  let makeTransferService: MakeTransferService;
  let transferAuthorizerService: TransferAuthorizerService;
  let sendNotifyService: SendNotifyService;
  let transferRepository: TransferRepository;
  let userRepository: UserRepository;
  let notifyRepository: NotifyRepository;

  const transferBody: ITransfer = {
    account_id: 'test-id',
    to_user_email: 'test@gmail.com',
    value: 50,
  };

  const user: IUser = {
    id: transferBody.account_id,
    role: 'user',
    full_name: 'any_name',
    cpf: '086.017.110-81',
    email: 'anyemail@gmail.com',
    password: 'anypassword123',
    balance: 0,
  };

  const userPositiveBalance: IUser = {
    ...user,
    balance: 100,
  };

  const userReceiver: IUser = {
    id: 'receiver_id',
    role: 'seller',
    full_name: 'receiver_name',
    cpf: '129.169.570-22',
    email: 'receiveremail@gmail.com',
    password: 'receiverpassword123',
    balance: 0,
  };

  const sendNotifyData: INotify = {
    payer_name: userPositiveBalance.full_name,
    payer_cpf: userPositiveBalance.cpf,
    transfer_amount: transferBody.value,
    transfer_time: expect.any(Date),
    to_user_id: userReceiver.id,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MakeTransferService,
        TransferAuthorizerService,
        SendNotifyService,
        {
          provide: TransferRepository,
          useValue: {
            transfer: jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: NotifyRepository,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    makeTransferService =
      module.get<MakeTransferService>(MakeTransferService);

    transferAuthorizerService = module.get<TransferAuthorizerService>(
      TransferAuthorizerService,
    );

    sendNotifyService = module.get<SendNotifyService>(SendNotifyService);
    transferRepository = module.get<TransferRepository>(TransferRepository);
    userRepository = module.get<UserRepository>(UserRepository);
    notifyRepository = module.get<NotifyRepository>(NotifyRepository);

    jest.spyOn(makeTransferService, 'execute');
    jest.spyOn(transferAuthorizerService, 'execute');
    jest.spyOn(sendNotifyService, 'execute');
  });

  it('should be defined', () => {
    expect(makeTransferService).toBeDefined();
    expect(transferAuthorizerService).toBeDefined();
    expect(sendNotifyService).toBeDefined();
    expect(transferRepository).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(notifyRepository).toBeDefined();
  });

  it(`should NOT make a transfer if JWT user by id doesn't exists`, async () => {
    await expect(makeTransferService.execute(transferBody)).rejects.toThrow(
      new InvalidUserByIdException(),
    );

    expect(makeTransferService.execute).toHaveBeenCalledWith(transferBody);

    expect(userRepository.findById).toHaveBeenCalledWith(
      transferBody.account_id,
    );

    expect(userRepository.findByEmail).toHaveBeenCalledTimes(0);
    expect(transferAuthorizerService.execute).toHaveBeenCalledTimes(0);
    expect(transferRepository.transfer).toHaveBeenCalledTimes(0);
    expect(notifyRepository.send).toHaveBeenCalledTimes(0);
    expect(sendNotifyService.execute).toHaveBeenCalledTimes(0);
  });

  it('should NOT make a transfer if user role is seller', async () => {
    const userShopkeeper: IUser = {
      id: transferBody.account_id,
      role: 'seller',
      full_name: 'any_name',
      cpf: '261.398.680-84',
      email: 'anyemail@gmail.com',
      password: 'anypassword123',
      balance: 0,
    };

    (userRepository.findById as jest.Mock).mockResolvedValue(
      userShopkeeper,
    );

    await expect(makeTransferService.execute(transferBody)).rejects.toThrow(
      new UnauthorizedRoleTransferException(),
    );

    expect(makeTransferService.execute).toHaveBeenCalledWith(transferBody);

    expect(userRepository.findById).toHaveBeenCalledWith(
      transferBody.account_id,
    );

    expect(userRepository.findByEmail).toHaveBeenCalledTimes(0);
    expect(transferAuthorizerService.execute).toHaveBeenCalledTimes(0);
    expect(transferRepository.transfer).toHaveBeenCalledTimes(0);
    expect(notifyRepository.send).toHaveBeenCalledTimes(0);
    expect(sendNotifyService.execute).toHaveBeenCalledTimes(0);
  });

  it('should NOT make a transfer if the user email is invalid', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(user);

    await expect(makeTransferService.execute(transferBody)).rejects.toThrow(
      new InvalidEmailTransferException(),
    );

    expect(makeTransferService.execute).toHaveBeenCalledWith(transferBody);

    expect(userRepository.findById).toHaveBeenCalledWith(
      transferBody.account_id,
    );

    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      transferBody.to_user_email,
    );

    expect(transferAuthorizerService.execute).toHaveBeenCalledTimes(0);
    expect(transferRepository.transfer).toHaveBeenCalledTimes(0);
    expect(notifyRepository.send).toHaveBeenCalledTimes(0);
    expect(sendNotifyService.execute).toHaveBeenCalledTimes(0);
  });

  it(`should NOT make a transfer if the receiver's email is the same as the payer's`, async () => {
    const userSameEmail: IUser = {
      ...user,
      email: transferBody.to_user_email,
    };

    (userRepository.findById as jest.Mock).mockResolvedValue(userSameEmail);
    (userRepository.findByEmail as jest.Mock).mockResolvedValue(user);

    await expect(makeTransferService.execute(transferBody)).rejects.toThrow(
      new TransferToOwnEmailException(),
    );

    expect(makeTransferService.execute).toHaveBeenCalledWith(transferBody);

    expect(userRepository.findById).toHaveBeenCalledWith(
      transferBody.account_id,
    );

    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      transferBody.to_user_email,
    );

    expect(transferAuthorizerService.execute).toHaveBeenCalledTimes(0);
    expect(transferRepository.transfer).toHaveBeenCalledTimes(0);
    expect(notifyRepository.send).toHaveBeenCalledTimes(0);
    expect(sendNotifyService.execute).toHaveBeenCalledTimes(0);
  });

  it(`should NOT make a transfer if the payer's balance is equal to zero`, async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(user);
    (userRepository.findByEmail as jest.Mock).mockResolvedValue(
      userReceiver,
    );

    await expect(makeTransferService.execute(transferBody)).rejects.toThrow(
      new InsufficientBalanceException(),
    );

    expect(makeTransferService.execute).toHaveBeenCalledWith(transferBody);

    expect(userRepository.findById).toHaveBeenCalledWith(
      transferBody.account_id,
    );

    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      transferBody.to_user_email,
    );

    expect(transferAuthorizerService.execute).toHaveBeenCalledTimes(0);
    expect(transferRepository.transfer).toHaveBeenCalledTimes(0);
    expect(notifyRepository.send).toHaveBeenCalledTimes(0);
    expect(sendNotifyService.execute).toHaveBeenCalledTimes(0);
  });

  it(`should NOT make a transfer if the payer's balance is less than zero`, async () => {
    const userBalanceLessThanZero: IUser = {
      ...user,
      balance: -208.31,
    };

    (userRepository.findById as jest.Mock).mockResolvedValue(
      userBalanceLessThanZero,
    );

    (userRepository.findByEmail as jest.Mock).mockResolvedValue(
      userReceiver,
    );

    await expect(makeTransferService.execute(transferBody)).rejects.toThrow(
      new InsufficientBalanceException(),
    );

    expect(makeTransferService.execute).toHaveBeenCalledWith(transferBody);

    expect(userRepository.findById).toHaveBeenCalledWith(
      transferBody.account_id,
    );

    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      transferBody.to_user_email,
    );

    expect(transferAuthorizerService.execute).toHaveBeenCalledTimes(0);
    expect(transferRepository.transfer).toHaveBeenCalledTimes(0);
    expect(notifyRepository.send).toHaveBeenCalledTimes(0);
    expect(sendNotifyService.execute).toHaveBeenCalledTimes(0);
  });

  it(`should NOT make a transfer if the payer's balance after the transfer is less than zero`, async () => {
    const sendMoreAvailableBalance = userPositiveBalance.balance + 1;

    (userRepository.findById as jest.Mock).mockResolvedValue(
      userPositiveBalance,
    );

    (userRepository.findByEmail as jest.Mock).mockResolvedValue(
      userReceiver,
    );

    const transferBodySendMoreAvailableBalance: ITransfer = {
      ...transferBody,
      value: sendMoreAvailableBalance,
    };

    await expect(
      makeTransferService.execute(transferBodySendMoreAvailableBalance),
    ).rejects.toThrow(new InsufficientBalanceException());

    expect(makeTransferService.execute).toHaveBeenCalledWith(
      transferBodySendMoreAvailableBalance,
    );

    expect(userRepository.findById).toHaveBeenCalledWith(
      transferBody.account_id,
    );

    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      transferBody.to_user_email,
    );

    expect(transferAuthorizerService.execute).toHaveBeenCalledTimes(0);
    expect(transferRepository.transfer).toHaveBeenCalledTimes(0);
    expect(notifyRepository.send).toHaveBeenCalledTimes(0);
    expect(sendNotifyService.execute).toHaveBeenCalledTimes(0);
  });

  it('should NOT make a transfer if unauthorized by external API', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(
      userPositiveBalance,
    );

    (userRepository.findByEmail as jest.Mock).mockResolvedValue(
      userReceiver,
    );

    (transferAuthorizerService.execute as jest.Mock).mockResolvedValue(
      'Negado',
    );

    await expect(makeTransferService.execute(transferBody)).rejects.toThrow(
      new TransferErrorException(),
    );

    expect(makeTransferService.execute).toHaveBeenCalledWith(transferBody);

    expect(userRepository.findById).toHaveBeenCalledWith(
      transferBody.account_id,
    );

    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      transferBody.to_user_email,
    );

    expect(transferAuthorizerService.execute).toHaveBeenCalledTimes(1);
    expect(transferRepository.transfer).toHaveBeenCalledTimes(0);
    expect(notifyRepository.send).toHaveBeenCalledTimes(0);
    expect(sendNotifyService.execute).toHaveBeenCalledTimes(0);
  });

  it(`should NOT make a transfer if notification isn't sent by external API`, async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(
      userPositiveBalance,
    );

    (userRepository.findByEmail as jest.Mock).mockResolvedValue(
      userReceiver,
    );

    (transferAuthorizerService.execute as jest.Mock).mockResolvedValue(
      'Autorizado',
    );

    (sendNotifyService.execute as jest.Mock).mockResolvedValue('Not sent');

    await expect(makeTransferService.execute(transferBody)).rejects.toThrow(
      new TransferErrorException(),
    );

    expect(makeTransferService.execute).toHaveBeenCalledWith(transferBody);

    expect(userRepository.findById).toHaveBeenCalledWith(
      transferBody.account_id,
    );

    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      transferBody.to_user_email,
    );

    expect(transferAuthorizerService.execute).toHaveBeenCalledTimes(1);
    expect(transferRepository.transfer).toHaveBeenCalledWith(transferBody);
    expect(notifyRepository.send).toHaveBeenCalledWith(sendNotifyData);
    expect(sendNotifyService.execute).toHaveBeenCalledTimes(1);
  });

  it('should make a transfer', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(
      userPositiveBalance,
    );

    (userRepository.findByEmail as jest.Mock).mockResolvedValue(
      userReceiver,
    );

    (transferAuthorizerService.execute as jest.Mock).mockResolvedValue(
      'Autorizado',
    );

    (sendNotifyService.execute as jest.Mock).mockResolvedValue('Success');

    await expect(
      makeTransferService.execute(transferBody),
    ).resolves.toEqual(
      `Transferência realizada com sucesso para ${transferBody.to_user_email} no valor de R$${transferBody.value}.`
    );

    expect(makeTransferService.execute).toHaveBeenCalledWith(transferBody);

    expect(userRepository.findById).toHaveBeenCalledWith(
      transferBody.account_id,
    );

    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      transferBody.to_user_email,
    );

    expect(transferAuthorizerService.execute).toHaveBeenCalledTimes(1);
    expect(transferRepository.transfer).toHaveBeenCalledWith(transferBody);
    expect(notifyRepository.send).toHaveBeenCalledWith(sendNotifyData);
    expect(sendNotifyService.execute).toHaveBeenCalledTimes(1);
  });
});