import {
  Body,
  Controller,
  Get,
  ParseArrayPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RentalService } from './rental.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Role } from 'src/common/decorators/role.decorator';
import { RentalCreateDto } from './dto/rental-create.dto';

@Controller('rental')
@UseGuards(JwtAuthGuard)
@Role('ADMIN')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Get()
  async findAll() {
    const rental = await this.rentalService.findAll();
    return {
      data: rental,
      message: 'Rental berhasil ditemukan',
      statusCode: 200,
    };
  }

  @Post()
  async create(
    @Body(new ParseArrayPipe({ items: RentalCreateDto, whitelist: true }))
    data: RentalCreateDto[],
  ) {
    const rental = await this.rentalService.create(data);
    return {
      data: rental,
      message: 'Rental berhasil dibuat',
      statusCode: 201,
    };
  }
}
