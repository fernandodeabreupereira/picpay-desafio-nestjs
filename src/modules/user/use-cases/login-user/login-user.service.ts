import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IReturnUser } from '../../../../interfaces/return-user';
import { IService } from '../../../../interfaces/service';
import { IUserPayload } from '../../../../modules/auth/models/user-payload';

@Injectable()
export class LoginUserService implements IService {
  constructor (private readonly _jwtService: JwtService) { }

  async execute (data: IReturnUser): Promise<string> {
    const payload: IUserPayload = {
      sub: data.id,
      role: data.role,
      full_name: data.full_name,
      email: data.email,
    };

    const JWT = this._jwtService.sign(payload);

    return JWT;
  }
}