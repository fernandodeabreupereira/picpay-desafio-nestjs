import { Test, TestingModule } from "@nestjs/testing";
import { IReturnLoggedInUser } from "src/interfaces/return-logged-in-user";
import { InvalidUserByIdException } from "../../../../exceptions/user/user-exists-by-id.exception";
import { IUser } from "../../../../models/user";
import { UserRepository } from "../../../../repositories/abstracts/user.repository";
import { LoggedInUserService } from "./logged-in-user.service";
import exp from "constants";

describe('LoggedInService', () => {
  let loggedInUserService: LoggedInUserService;
  let userRepository: UserRepository

  const user: IUser = {
    id: 'any_id',
    role: 'user',
    full_name: 'any_name',
    cpf: '086.017.110-81',
    email: 'fernandodeabreupereira@gmail.com',
    password: 'senha123',
    balance: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggedInUserService,
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn()
          }
        }
      ]
    }).compile();

    loggedInUserService = module.get<LoggedInUserService>(LoggedInUserService);
    userRepository = module.get<UserRepository>(UserRepository);

    jest.spyOn(loggedInUserService, 'execute');
  });

  it('should be defined', () => {
    expect(loggedInUserService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it(`should NOT show authenticated user if token user by id doesn't exists in database`, async () => {
    const invalidToken = '1234567890';

    await expect(loggedInUserService.execute(invalidToken)).rejects.toThrow(new InvalidUserByIdException);

    expect(userRepository.findById).toHaveBeenCalledWith(invalidToken);
  });

  it('should show authenticated user', async () => {
    (userRepository.findById as jest.Mock).mockResolvedValue(user);

    const loggedInUser: IReturnLoggedInUser = {
      role: user.role,
      full_name: user.full_name,
      email: user.email,
      balance: user.balance
    };

    const resultLoggedInUser = await loggedInUserService.execute(user.id);

    expect(resultLoggedInUser).toEqual(loggedInUser);
    expect(userRepository.findById).toHaveBeenCalledWith(user.id);
    expect(loggedInUserService.execute).toHaveBeenCalledWith(user.id);
  });
});