import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email tidak valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  email: string;
  @IsString()
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MinLength(8)
  @MaxLength(20)
  password: string;
  @IsString({ message: 'Nama harus berupa string' })
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  name: string;
  @IsString({ message: 'Phone harus berupa string' })
  @IsNotEmpty({ message: 'Phone tidak boleh kosong' })
  phone: string;
  @IsString({ message: 'Roles harus berupa string' })
  @IsOptional()
  roles: string;
}
