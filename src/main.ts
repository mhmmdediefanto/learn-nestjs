import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT!);
  app.useGlobalPipes(new ValidationPipe());
  console.log(`Application is running on: ${await app.getUrl()}`);
}
// Panggil fungsi dan tambahkan .catch() untuk menangani kesalahan
bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  // Mungkin keluar dari proses dengan kode error
  process.exit(1);
});
