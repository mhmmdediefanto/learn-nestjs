import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { PrismaModule } from 'src/infra/database/prisma.module';

@Module({
  controllers: [RentalController],
  providers: [RentalService],
  imports: [PrismaModule],
})
export class RentalModule {}
