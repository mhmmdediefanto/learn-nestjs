-- AlterTable
ALTER TABLE "Rental" ADD COLUMN     "returnDate" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'BOOKED';
