import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty()
  @IsString({ message: 'Email harus berupa string' })
  email: string;

  @IsNotEmpty()
  @IsString({ message: 'Password harus berupa string' })
  password: string;
}
