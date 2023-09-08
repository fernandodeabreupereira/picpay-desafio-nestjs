import { AuthModule } from './modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
  ],
  providers: [
    // {
    //   // Ativa o JwtAuthGuard globalmente para toda a aplicação, mas desativa-o para uma rota específica usando o Decorador Personalizado @IsPublic() no Controller.
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule { }
