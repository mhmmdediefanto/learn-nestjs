import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RentalCreateDto {
  @IsNotEmpty({ message: 'User id harus di isi' })
  @IsString({ message: 'User id harus berupa string' })
  userId: string;

  @IsNotEmpty({ message: 'Tool id harus di isi' })
  @IsString({ message: 'Tool id harus berupa string' })
  toolId: string;

  @IsNotEmpty({ message: 'Quantity harus di isi' })
  @IsNumber({ allowNaN: false }, { message: 'Quantity harus berupa ankga' })
  quantity: number;

  @IsNotEmpty({ message: 'Start date harus di isi' })
  @IsString({ message: 'Start date harus berupa string' })
  startDate: Date;

  @IsNotEmpty({ message: 'End date harus di isi' })
  @IsString({ message: 'End date harus berupa string' })
  endDate: Date;

  @IsNotEmpty({ message: 'Status harus di isi' })
  @IsString({ message: 'Status harus berupa string' })
  status: string;

  @IsNotEmpty({ message: 'Total price harus di isi' })
  @IsNumber({ allowNaN: false }, { message: 'Total price harus berupa angka' })
  totalPrice: number;

  @IsOptional()
  @IsString({ message: 'Return date harus berupa string' })
  returnDate: Date;
}
