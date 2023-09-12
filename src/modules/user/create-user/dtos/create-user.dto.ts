import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { IsCPF } from 'class-validator-cpf';

export class CreateUserDTO {
  @ApiProperty({
    description: `A role deve ser uma role válida entre "user" e "seller", em que 
        "user" pode fazer e receber transferências, e "seller" pode apenas receber transferências `,
    enum: ['user', 'seller'],
    default: 'user',
  })
  @IsNotEmpty()
  @IsIn(['user', 'seller'])
  readonly role: 'user' | 'seller';

  @ApiProperty({ example: 'Fernando Pereira' })
  @IsNotEmpty()
  @IsString()
  readonly full_name: string;

  @ApiProperty({
    description:
      'O CPF deve ser um CPF válido no formato XXX.XXX.XXX-XX ou XXXXXXXXXXX ',
    examples: ['086.017.110-81', '08601711081'],
  })
  @IsNotEmpty()
  @IsCPF()
  readonly cpf: string;

  @ApiProperty({ type: 'email', example: 'fernandodeabreupereira@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'fernando123' })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}