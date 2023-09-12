import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/models/user';
import { UserRepository } from '../../../repositories/abstracts/user.repository';
import { LoginRequestBody } from '../models/login-request-body';

describe('AuthService', () => {
  let service: AuthService;
  let repository: UserRepository;
  let bcryptSpy: jest.SpyInstance;

  const user: IUser = {
    id: 'any_id',
    role: 'seller',
    full_name: 'Usuario vendedor',
    email: 'usuariovendedor@gmail.com',
    cpf: '516.204.440-70',
    password: 'usuariovendedor123',
  };

  const userData: LoginRequestBody = {
    email: 'usuarioteste@gmail.com',
    password: 'usuarioteste123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<UserRepository>(UserRepository);

    jest.spyOn(service, 'validateUser');
    bcryptSpy = jest.spyOn(bcrypt, 'compare');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(bcryptSpy).toBeDefined();
  });

  it('should NOT validate a user if email is invalid', async () => {
    (repository.findByEmail as jest.Mock).mockResolvedValue(false);

    await expect(
      service.validateUser(userData.email, userData.password),
    ).rejects.toThrow(new Error('Email ou senha incorreto(s).'));

    expect(service.validateUser).toHaveBeenCalledTimes(1);
    expect(repository.findByEmail).toHaveBeenCalledWith(userData.email);
  });

  it('should NOT validade a user if compare password is invalid', async () => {
    (repository.findByEmail as jest.Mock).mockResolvedValue(user);
    bcryptSpy.mockResolvedValue(false);

    await expect(
      service.validateUser(userData.email, userData.password),
    ).rejects.toThrow(new Error('Email ou senha incorreto(s).'));

    expect(service.validateUser).toHaveBeenCalledTimes(1);
    expect(bcryptSpy).toHaveBeenCalledTimes(1);
    expect(repository.findByEmail).toHaveBeenCalledWith(userData.email);

    expect(bcryptSpy).toHaveBeenCalledWith(
      userData.password,
      user.password,
    );
  });

  it('should validate a valid user', async () => {
    (repository.findByEmail as jest.Mock).mockResolvedValue(user);
    bcryptSpy.mockResolvedValue(true);

    // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
    const { password: _, ...returnUser } = user;

    const result = await service.validateUser(
      userData.email,
      userData.password,
    );

    expect(result).toEqual(returnUser);
    expect(service.validateUser).toHaveBeenCalledTimes(1);
    expect(bcryptSpy).toHaveBeenCalledTimes(1);
    expect(repository.findByEmail).toHaveBeenCalledWith(userData.email);

    expect(bcryptSpy).toHaveBeenCalledWith(
      userData.password,
      user.password,
    );
  });
});