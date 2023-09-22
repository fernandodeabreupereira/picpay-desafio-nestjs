import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { LoginValidationBodyModule } from './modules/login-validation-body/login-validation-body.module';
import { TransferModule } from './modules/transfer/transfer.module';
import { UserModule } from './modules/user/user.module';
import { TransferAuthorizerService } from './providers/transfer-authorizer/transfer-authorizer.service';
import { PrismaDatabaseModule } from './repositories/implementations/prisma/prisma-database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UserModule,
    AuthModule,
    LoginValidationBodyModule,
    TransferModule,
    PrismaDatabaseModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    TransferAuthorizerService
  ],
})
export class AppModule { }
