import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IController, returnHandle } from '../../../../interfaces/controller';
import { RouteIsPublic } from '../../../../validators/route-is-public.decorator';
import { CreateUserService } from './create-user.service';
import { CreateUserDTO } from './dtos/create-user.dto';

@Controller('auth')
export class CreateUserController implements IController {
  constructor (private readonly _createUserService: CreateUserService) { }

  @ApiTags('auth-user')
  @ApiBadRequestResponse()
  @ApiCreatedResponse()
  @RouteIsPublic()
  @Post('register')
  async handle (@Body() body: CreateUserDTO): Promise<returnHandle> {
    const createUser = await this._createUserService.execute(body);

    return {
      message: 'Usuário cadastrado com sucesso.',
      data: createUser,
    };
  }
}