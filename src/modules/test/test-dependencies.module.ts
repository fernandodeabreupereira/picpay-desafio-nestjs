import { Global, Module } from '@nestjs/common';
import { UserRepository } from '../../repositories/abstracts/user.repository';
import { UserModule } from '../user/user.module';
import { UserRepositorySQLInMemory } from './sql-in-memory/user-repository-sql-in-memory.service';
import { TransferRepository } from '../../repositories/abstracts/transfer.repository';
import { TransferRepositorySQLInMemory } from './sql-in-memory/transfer-repository-sql-in-memory.service';
import { NotifyRepository } from '../../repositories/abstracts/notify.repository';
import { NotifyRepositorySQLInMemory } from './sql-in-memory/notify-repository-sql-in-memory.service';
import { TransferModule } from '../transfer/transfer.module';

@Global()
@Module({
    imports: [UserModule, TransferModule],
    providers: [
        {
            provide: UserRepository,
            useClass: UserRepositorySQLInMemory,
        },
        {
            provide: TransferRepository,
            useClass: TransferRepositorySQLInMemory,
        },
        {
            provide: NotifyRepository,
            useClass: NotifyRepositorySQLInMemory,
        },
    ],
    exports: [UserRepository, TransferRepository, NotifyRepository],
})
export class TestDependenciesModule { }
