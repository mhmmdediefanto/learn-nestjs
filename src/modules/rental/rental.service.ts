import { Injectable } from '@nestjs/common';
import { UserPayload } from 'src/common/types/user-palyload.interface';
import { PrismaService } from 'src/infra/database/prisma.service';
import { RentalCreateDto } from './dto/rental-create.dto';

@Injectable()
export class RentalService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const rental = await this.prisma.rental.findMany();
    return rental;
  }

  async create(user: UserPayload, data: RentalCreateDto) {
    const rental = await this.prisma.rental.createMany({
      data: {
        ...data,
        userId: user.id,
      },
    });
    return rental;
  }
}
