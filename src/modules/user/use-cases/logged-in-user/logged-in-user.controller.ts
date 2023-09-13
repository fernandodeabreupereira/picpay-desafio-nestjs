import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { IController, returnHandle } from './../../../../interfaces/controller';
import { IReturnUser } from './../../../../interfaces/return-user';
import { LoggedInUser } from './../../../../validators/logged-in-user.decorator';
import { LoggedInUserService } from './logged-in-user.service';

@Controller('auth')
export class LoggedInUserController implements IController {
  constructor (private readonly _loggedInUserService: LoggedInUserService) { }

  @ApiTags('auth-user')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @Get('loggedinuser')
  @HttpCode(200)
  async handle (@LoggedInUser() user: IReturnUser): Promise<returnHandle> {
    const logeedInUser = await this._loggedInUserService.execute(user.id);

    return {
      message: `${logeedInUser.email} autenticado.`,
      data: logeedInUser
    };
  }
}
