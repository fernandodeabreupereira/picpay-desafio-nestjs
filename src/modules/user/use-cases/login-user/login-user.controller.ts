import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { IController, returnHandle } from '../../../../interfaces/controller';
import { LoginRequestBody } from '../../../../modules/auth/models/login-request-body';
import { IAuthRequest } from '../../../../types/auth.request';
import { RouteIsPublic } from '../../../../validators/route-is-public.decorator';
import { LocalAuthGuard } from '../../../auth/guards/local-auth.guard';
import { LoginUserService } from './login-user.service';

@Controller('auth')
export class LoginUserController implements IController {
  constructor (private readonly _loginUserService: LoginUserService) { }

  @ApiTags('auth-user')
  @ApiBody({ type: LoginRequestBody })
  @ApiUnauthorizedResponse()
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @RouteIsPublic()
  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async handle (@Request() req: IAuthRequest): Promise<returnHandle> {
    const JWT = await this._loginUserService.execute(req.user);

    return {
      message: 'Login realizado com sucesso.',
      data: JWT,
    };
  }
}