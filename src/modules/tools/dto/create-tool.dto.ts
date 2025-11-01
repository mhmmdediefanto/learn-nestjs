import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateToolDto {
  @IsNotEmpty({ message: 'Title tidak boleh kosong' })
  @IsString({ message: 'Title harus berupa string' })
  name: string;

  @IsNotEmpty({ message: 'Description tidak boleh kosong' })
  @IsString({ message: 'Description harus berupa string' })
  description: string;

  @IsNotEmpty({ message: 'Category tidak boleh kosong' })
  @IsString({ message: 'Category harus berupa string' })
  category: string;

  @IsNotEmpty({ message: 'Price tidak boleh kosong' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price harus berupa angka' })
  pricePerDay: number;

  @IsNotEmpty({ message: 'Stock tidak boleh kosong' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'stock harus berupa angka' })
  stock: number;
}
