import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { RentalCreateDto } from './dto/rental-create.dto';
import { Rental } from 'generated/prisma/client';

@Injectable()
export class RentalService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const rental = await this.prisma.rental.findMany();
    return rental;
  }

  // Parameter 'datas' adalah array DTO
  async create(datas: RentalCreateDto[]) {
    // 1. Mulai transaksi SATU KALI di luar loop
    const createdRentals = await this.prisma.$transaction(async (prisma) => {
      // 2. Buat array penampung DI DALAM transaksi
      const rentals: Rental[] = [];

      // 3. Pindahkan loop DI DALAM transaksi
      for (const rentalData of datas) {
        // Cek tool (gunakan 'prisma' dari transaksi)
        const tool = await prisma.tool.findUnique({
          where: {
            id: rentalData.toolId,
          },
        });

        if (!tool) {
          throw new NotFoundException(
            `Tool dengan id ${rentalData.toolId} tidak ditemukan.`,
          );
        }

        if (tool.stock < rentalData.quantity) {
          throw new BadRequestException(`Stok ${tool.name} tidak mencukupi.`);
        }

        // Kurangi stok (gunakan 'prisma' dari transaksi)
        await prisma.tool.update({
          where: {
            id: rentalData.toolId,
          },
          data: {
            stock: {
              decrement: rentalData.quantity,
            },
          },
        });

        // Buat rental (gunakan 'prisma' dari transaksi)
        const newRental = await prisma.rental.create({
          data: {
            userId: rentalData.userId,
            toolId: rentalData.toolId,
            quantity: rentalData.quantity,
            startDate: rentalData.startDate,
            endDate: rentalData.endDate,
            status: rentalData.status,
            totalPrice: rentalData.totalPrice,
            returnDate: rentalData.returnDate,
          },
        });

        // 4. Dorong ke array penampung
        rentals.push(newRental);
      } // Loop lanjut ke item berikutnya...

      // 5. Setelah loop selesai, KEMBALIKAN array penampung
      // Ini akan menjadi nilai dari 'createdRentals'
      return rentals;
    });

    // 6. Kembalikan hasil transaksi
    return createdRentals;
  }
}
