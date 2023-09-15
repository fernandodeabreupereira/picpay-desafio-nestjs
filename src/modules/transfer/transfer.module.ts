import { Module } from '@nestjs/common';
import { SendNotifyService } from '../../providers/send-notify/send-notify.service';
import { TransferAuthorizerService } from '../../providers/transfer-authorizer/transfer-authorizer.service';
import { MakeTransferController } from './use-cases/make-transfer/make-transfer.controller';
import { MakeTransferService } from './use-cases/make-transfer/make-transfer.service';

@Module({
    controllers: [MakeTransferController],
    providers: [
        MakeTransferService,
        {
            provide: TransferAuthorizerService,
            useClass: TransferAuthorizerService,
        },
        SendNotifyService,
    ],
})
export class TransferModule { }
