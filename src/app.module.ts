import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { LoginValidationBodyModule } from './modules/login-validation-body/login-validation-body.module';
import { TransferModule } from './modules/transfer/transfer.module';
import { UserModule } from './modules/user/user.module';

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
  ],
  providers: [
    {
      // Ativa o JwtAuthGuard globalmente para toda a aplicação, mas desativa-o para uma rota específica usando o Decorador Personalizado @RouteIsPublic() no Controller.
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
