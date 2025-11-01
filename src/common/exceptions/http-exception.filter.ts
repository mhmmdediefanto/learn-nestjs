/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Terjadi kesalahan pada server';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;

      if (
        status === HttpStatus.BAD_REQUEST &&
        typeof res === 'object' &&
        res.message === undefined && // Pastikan ini BUKAN objek error NestJS standar
        !Array.isArray(res)
      ) {
        message = 'Terjadi kesalahan validasi'; // Pesan general
        errors = res; // 'res' adalah objek errornya
      }

      // KASUS 2: Error HttpException standar (string)
      // new HttpException('Pesan error', 404)
      else if (typeof res === 'string') {
        message = res;
      }

      // KASUS 3: Error HttpException standar (objek)
      // new HttpException({ message: 'Pesan error' }, 401)
      else if (res.message) {
        message = Array.isArray(res.message)
          ? res.message.join(', ')
          : res.message;
      }
    }

    response.status(status).json({
      statusCode: status,
      success: false,
      message,
      errors, // Sekarang 'errors' akan terisi
      path: request?.url,
      timestamp: new Date().toISOString(),
    });
  }
}
