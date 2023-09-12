import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CreateUserController } from './use-cases/create-user/create-user.controller';
import { CreateUserService } from './use-cases/create-user/create-user.service';

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: async () => ({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
        }),
    ],
    controllers: [CreateUserController],
    providers: [CreateUserService],
})
export class UserModule { }
