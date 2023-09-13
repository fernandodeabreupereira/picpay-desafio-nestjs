import { ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, NestApplication } from "@nestjs/core";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { invalidUserByIdExceptionMessage } from "../../../../exceptions/user/user-exists-by-id.exception";
import * as supertest from 'supertest';
import { IUser } from "../../../../models/user";
import { JwtAuthGuard } from "../../../../modules/auth/guards/jwt-auth.guard";
import { IUserPayload } from "../../../../modules/auth/models/user-payload";
import { JwtStrategy } from "../../../../modules/auth/strategies/jwt.strategy";
import { TestDependenciesModule } from "../../../../modules/test/test-dependencies.module";
import { UserRepository } from "../../../../repositories/abstracts/user.repository";
import { LoggedInUserService } from "./logged-in-user.service";

describe('LoggedInUserController', () => {
  let app: NestApplication;
  let loggedInUserService: LoggedInUserService;
  let userRepository: UserRepository;
  let jwtService: JwtService;
  let JWT: string;
  const route: string = '/auth/loggedinuser';

  const userPayload: IUserPayload = {
    role: 'user',
    email: 'any_email',
    full_name: 'any_full_name',
    sub: 'any_sub'
  };

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
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRATION_TEST }
        }),
        TestDependenciesModule
      ],
      providers: [
        JwtStrategy,
        JwtService,
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard
        }
      ]
    }).compile();

    app = module.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    }));

    loggedInUserService = module.get<LoggedInUserService>(LoggedInUserService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);

    jest.spyOn(loggedInUserService, 'execute');
    jest.spyOn(userRepository, 'findById');
    jest.spyOn(jwtService, 'sign');

    JWT = jwtService.sign(userPayload);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
    expect(loggedInUserService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  it('should generate a valid JWT for tests', () => {
    expect(JWT).toEqual(expect.any(String));
    expect(jwtService.sign).toHaveBeenCalledWith(userPayload);
  });

  it('should NOT show authenticated user if the JWT is invalid', async () => {
    const response = await supertest(app.getHttpServer())
      .get(route)
      .set('Authorization', `Bearer invalid_jwt`)
      .expect(401);

    const { message } = response.body;

    expect(message).toEqual('Invalid token.');
    expect(loggedInUserService.execute).toHaveBeenCalledTimes(0);
    expect(userRepository.findById).toHaveBeenCalledTimes(0);
  });

  it(`should NOT show authenticated user if token user by id doesn't exists in database`, async () => {
    const response = await supertest(app.getHttpServer())
      .get(route)
      .set('Authorization', `Bearer ${JWT}`)
      .expect(400);

    const { message } = response.body;

    expect(message).toEqual(invalidUserByIdExceptionMessage);
    expect(loggedInUserService.execute).toHaveBeenCalledWith(userPayload.sub);
    expect(userRepository.findById).toHaveBeenCalledWith(userPayload.sub);
  });

  it('should show autenticated user', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValue(user);

    const response = await supertest(app.getHttpServer())
      .get(route)
      .set('Authorization', `Bearer ${JWT}`)
      .expect(200);

    const { message } = response.body;

    expect(message).toEqual(`${user.email} autenticado.`);
    expect(loggedInUserService.execute).toHaveBeenCalledWith(userPayload.sub);
    expect(userRepository.findById).toHaveBeenCalledWith(userPayload.sub);
  });

});