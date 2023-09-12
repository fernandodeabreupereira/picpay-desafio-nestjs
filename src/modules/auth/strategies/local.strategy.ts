import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor (private _authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate (email: string, password: string) {
    return await this._authService.validateUser(email, password);
  }
}