import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RentalService } from './rental.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserPayload } from 'src/common/types/user-palyload.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Role } from 'src/common/decorators/role.decorator';
import { RentalCreateDto } from './dto/rental-create.dto';

@Controller('rental')
@UseGuards(JwtAuthGuard)
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Get()
  @Role('ADMIN')
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
    @Body() data: RentalCreateDto,
    @CurrentUser() user: UserPayload,
  ) {
    const rental = await this.rentalService.create(user, data);
    return {
      data: rental,
      message: 'Rental berhasil dibuat',
      statusCode: 201,
    };
  }
}
