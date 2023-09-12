import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginUserService } from './login-user.service';
import { IUserPayload } from '../../../../modules/auth/models/user-payload';

describe('LoginUserService', () => {
  let service: LoginUserService;

  const JWT = 'any_jwt';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUserService,
        {
          provide: JwtService,
          useExisting: JwtService,
          useValue: {
            sign: jest.fn().mockResolvedValue(JWT),
          },
        },
      ],
    }).compile();

    service = module.get<LoginUserService>(LoginUserService);

    jest.spyOn(service, 'execute');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a JWT with a valid payload', async () => {
    const payload: IUserPayload = {
      sub: 'any_id',
      role: 'user',
      full_name: 'Test',
      email: 'test@gmail.com',
    };

    const result = await service.execute(payload);

    expect(result).toEqual(JWT);
    expect(service.execute).toHaveBeenCalledTimes(1);
    expect(service.execute).toHaveBeenCalledWith(payload);
  });
});