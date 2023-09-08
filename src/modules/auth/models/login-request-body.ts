import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestBody {
  @ApiProperty({ type: 'email', example: 'fernandodeabreupereira@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha#forte.' })
  @IsNotEmpty()
  @IsString()
  password: string;
}