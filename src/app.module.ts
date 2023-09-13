import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { LoginValidationBodyModule } from './modules/login-validation-body/login-validation-body.module';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UserModule,
    AuthModule,
    LoginValidationBodyModule,
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
