import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { LoginValidationBodyMiddleware } from "./middlewares/login-validation-body.middleware";
import { AuthService } from "./services/auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
    imports: [UserModule],
    providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule implements NestModule {
    configure (consumer: MiddlewareConsumer) {
        consumer.apply(LoginValidationBodyMiddleware).forRoutes('auth/login');
    }
}