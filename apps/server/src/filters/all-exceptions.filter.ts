import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseDto } from 'src/common/common.dto';

@Catch() // 모든 예외를 catch
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException ? exception.getResponse() : exception;
    console.error(
      `Exception caught: ${JSON.stringify(message)} with status: ${status}, url : ${request.url}`,
    );
    const dto = new ResponseDto(
      { success: false, data: null },
      'error',
      JSON.stringify(message),
    );
    response.status(status).json(dto);
  }
}
