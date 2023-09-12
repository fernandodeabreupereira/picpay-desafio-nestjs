import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as supertest from 'supertest';
import { IUser } from '../../../../models/user';
import { AuthService } from '../../../../modules/auth/services/auth.service';
import { UserRepository } from '../../../../repositories/abstracts/user.repository';
import { LocalStrategy } from '../../../auth/strategies/local.strategy';
import { LoginValidationBodyModule } from '../../../login-validation-body/login-validation-body.module';
import { LoginUserController } from './login-user.controller';
import { LoginUserService } from './login-user.service';
import { invalidLoginExceptionMessage } from '../../../../exceptions/auth/invalid-login.exception';

describe('LoginUserController', () => {
  let app: INestApplication;
  let repository: UserRepository;
  let service: LoginUserService;
  let bcryptCompare: jest.SpyInstance;
  const route = '/auth/login';

  const user: IUser = {
    id: 'any_id',
    role: 'user',
    full_name: 'Test',
    email: 'test@gmail.com',
    cpf: '086.017.110-81',
    password: 'test123',
  };

  const { password, ...userWithoutPass } = user;

  type loginRequestBody = { email: string; password: string };

  const loginBody: loginRequestBody = {
    email: 'test@gmail.com',
    password: 'test123',
  };

  class JwtServiceMock extends JwtService {
    private readonly _secretKey = process.env.JWT_SECRET;

    sign (
      payload: string | object | Buffer,
      options?: JwtSignOptions,
    ): string {
      return jwt.sign(payload, this._secretKey, options);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        PassportModule.register({ defaultStrategy: 'local' }),
        LoginValidationBodyModule,
      ],
      controllers: [LoginUserController],
      providers: [
        LoginUserService,
        {
          provide: JwtService,
          useClass: JwtServiceMock,
        },
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        LocalStrategy,
        AuthService,
      ],
    }).compile();

    app = module.createNestApplication();

    repository = module.get<UserRepository>(UserRepository);
    service = module.get<LoginUserService>(LoginUserService);

    jest.spyOn(service, 'execute');
    bcryptCompare = jest.spyOn(bcrypt, 'compare');

    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
    expect(bcryptCompare).toBeDefined();
  });

  it('should NOT generate a JWT if the body is invalid', async () => {
    const invalidLoginBody = {
      apple: 'anything',
      orange: 'sometime',
    };

    const response = await supertest(app.getHttpServer())
      .post(route)
      .send(invalidLoginBody)
      .expect(400);

    const { message } = response.body;
    const expectedMessage = [
      'email must be an email',
      'email should not be empty',
      'password must be a string',
      'password should not be empty',
    ];

    expect(message).toEqual(expectedMessage);
    expect(service.execute).toHaveBeenCalledTimes(0);
    expect(repository.findByEmail).toHaveBeenCalledTimes(0);
    expect(bcryptCompare).toHaveBeenCalledTimes(0);
  });

  it('should NOT generate a JWT for a invalid user', async () => {
    const response = await supertest(app.getHttpServer())
      .post(route)
      .send(loginBody)
      .expect(401);

    const { message } = response.body;

    expect(message).toEqual(invalidLoginExceptionMessage);
    expect(repository.findByEmail).toHaveBeenCalledWith(loginBody.email);
    expect(bcryptCompare).toHaveBeenCalledTimes(0);
    expect(service.execute).toHaveBeenCalledTimes(0);
  });

  it('should generate a JWT for a valid user', async () => {
    (repository.findByEmail as jest.Mock).mockResolvedValue(user);
    bcryptCompare.mockResolvedValue(true);

    const response = await supertest(app.getHttpServer())
      .post(route)
      .send(loginBody)
      .expect(200);

    const JWT = response.body.data;

    expect(JWT).toEqual(expect.any(String));
    expect(repository.findByEmail).toHaveBeenCalledWith(loginBody.email);
    expect(service.execute).toHaveBeenCalledWith(userWithoutPass);
    expect(bcryptCompare).toHaveBeenCalledWith(
      loginBody.password,
      user.password,
    );
  });
});