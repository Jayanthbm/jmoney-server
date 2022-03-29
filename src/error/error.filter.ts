import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.GATEWAY_TIMEOUT) {
      return response.status(status).send({
        message: 'Server is down, please try again later',
        type: 'error',
      });
    } else {
      return response.status(status).send({
        message: exception.response.message
          ? typeof exception.response.message === 'object'
            ? exception.response.message[0]
            : exception.response.message
          : 'Something went wrong',
        type: 'error',
      });
    }
  }
}
