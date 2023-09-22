import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma-client.service';
import { ITransfer } from '../../../../models/transfer';
import { IUser } from '../../../../models/user';
import { prismaServiceTest } from '../test/prisma-service-test';
import { PrismaUserRepository } from '../user/prisma-user-repository';
import { PrismaTransferRepository } from './prisma-transfer-repository';

describe('PrismaTransferRepository', () => {
  let prismaUserRepository: PrismaUserRepository;
  let prismaTransferRepository: PrismaTransferRepository;
  let prismaService: PrismaService;
  let payerUser: IUser;
  let expectedPayerUser: object;
  let receiverUser: IUser;
  let expectedReceiverUser: object;

  const payerUserData: IUser = {
    role: 'user',
    full_name: 'payer',
    cpf: '08601711081',
    email: 'payer@gmail.com',
    password: 'payer',
    balance: 210.5,
  };

  const receiverUserData: IUser = {
    role: 'seller',
    full_name: 'receiver',
    cpf: '12916957022',
    email: 'receiver@gmail.com',
    password: 'receiver',
    balance: 0,
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: prismaServiceTest,
        },
        PrismaTransferRepository,
        PrismaUserRepository,
      ],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);

    prismaUserRepository =
      module.get<PrismaUserRepository>(PrismaUserRepository);

    prismaTransferRepository = module.get<PrismaTransferRepository>(
      PrismaTransferRepository,
    );

    jest.spyOn(prismaUserRepository, 'create');
    jest.spyOn(prismaTransferRepository, 'transfer');
    jest.spyOn(prismaUserRepository, 'findById');
  });

  afterAll(async () => {
    await prismaService.notify.deleteMany();

    await prismaService.user.deleteMany();
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
    expect(prismaTransferRepository).toBeDefined();
    expect(prismaUserRepository).toBeDefined();
  });

  it('should create the users', async () => {
    payerUser = await prismaUserRepository.create(payerUserData);

    expectedPayerUser = {
      id: expect.any(String),
      ...payerUser,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    };

    receiverUser = await prismaUserRepository.create(receiverUserData);

    expectedReceiverUser = {
      id: expect.any(String),
      ...receiverUser,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    };

    const users = await prismaService.user.findMany();

    expect(prismaUserRepository.create).toHaveBeenCalledWith(payerUserData);

    expect(prismaUserRepository.create).toHaveBeenCalledWith(
      receiverUserData,
    );

    expect(users).toHaveLength(2);
    expect(users[0]).toEqual(expectedPayerUser);
    expect(users[1]).toEqual(expectedReceiverUser);
  });

  it('should make a transfer', async () => {
    const transferData: ITransfer = {
      account_id: payerUser.id,
      to_user_email: receiverUser.email,
      value: 10.5,
    };

    await prismaTransferRepository.transfer(transferData);

    const payerUserFound = await prismaUserRepository.findById(
      payerUser.id,
    );

    const receiverUserFound = await prismaUserRepository.findById(
      receiverUser.id,
    );

    expect(prismaTransferRepository.transfer).toHaveBeenCalledWith(
      transferData,
    );

    expect(prismaUserRepository.findById).toHaveBeenCalledWith(
      payerUser.id,
    );

    expect(payerUser).toEqual(expectedPayerUser);

    expect(prismaUserRepository.findById).toHaveBeenCalledWith(
      receiverUser.id,
    );

    expect(receiverUser).toEqual(expectedReceiverUser);

    expect(payerUserFound.balance).toEqual(
      payerUser.balance - transferData.value,
    );

    expect(receiverUserFound.balance).toEqual(
      receiverUser.balance + transferData.value,
    );
  });
});