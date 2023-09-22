import { Global, Module } from '@nestjs/common';
import { NotifyRepository } from '../../../repositories/abstracts/notify.repository';
import { TransferRepository } from '../../../repositories/abstracts/transfer.repository';
import { UserRepository } from '../../../repositories/abstracts/user.repository';
import { PrismaNotifyRepository } from './notify/prisma-notify-repository';
import { PrismaService } from './prisma-client.service';
import { PrismaTransferRepository } from './transfer/prisma-transfer-repository';
import { PrismaUserRepository } from './user/prisma-user-repository';

@Global()
@Module({
    exports: [UserRepository, TransferRepository, NotifyRepository],
    providers: [
        PrismaService,
        {
            provide: UserRepository,
            useClass: PrismaUserRepository,
        },
        {
            provide: TransferRepository,
            useClass: PrismaTransferRepository,
        },
        {
            provide: NotifyRepository,
            useClass: PrismaNotifyRepository,
        },
    ],
})
export class PrismaDatabaseModule { }
