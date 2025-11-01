import { NestFactory, Reflector } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // untuk global dto validation class validator
  app.useGlobalPipes(new ValidationPipe());

  // untuk prefiks url api
  app.setGlobalPrefix('api');

  // untuk handler errors
  app.useGlobalFilters(new HttpExceptionFilter());
  // untuk serialize class
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // cookie parser
  app.use(cookieParser());
  // enable cors
  app.enableCors({
    origin: '*',
    credential: true,
  });

  await app.listen(process.env.PORT!);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
// Panggil fungsi dan tambahkan .catch() untuk menangani kesalahan
bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
