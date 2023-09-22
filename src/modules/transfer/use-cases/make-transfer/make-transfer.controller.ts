import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MakeTransferService } from './make-transfer.service';
import { IController, returnHandle } from '../../../../interfaces/controller';
import { IReturnUser } from '../../../../interfaces/return-user';
import { LoggedInUser } from '../../../../validators/logged-in-user.decorator';
import { MakeTransferDTO } from './dtos/make-transfer.dto';

@Controller()
export class MakeTransferController implements IController {
  constructor (private readonly _makeTransferService: MakeTransferService) { }

  @ApiTags('transferencia')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiResponse({ status: 402 })
  @ApiInternalServerErrorResponse()
  @ApiOkResponse()
  @Post('transfer')
  @HttpCode(200)
  async handle (
    @LoggedInUser() user: IReturnUser,
    @Body() body: MakeTransferDTO,
  ): Promise<returnHandle> {
    const makeTransfer = await this._makeTransferService.execute({
      account_id: user.id,
      ...body,
    });

    return {
      message: makeTransfer,
    };
  }
}