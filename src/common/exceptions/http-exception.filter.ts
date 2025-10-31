/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = ctx.getResponse<any>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Terjadi kesalahan pada server';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as
        | { message?: string | string[] }
        | string;

      if (typeof res === 'string') {
        message = res;
      } else if (res.message) {
        message = Array.isArray(res.message)
          ? res.message.join(', ')
          : res.message;
      }
    }

    response.status(status).json({
      statusCode: status,
      success: false,
      message,
      data: null,
      path: request?.url,
      timestamp: new Date().toISOString(),
    });
  }
}
