// src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  Inject,
  Optional,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import type {
  ErrorResponse,
  ErrorResponseDev,
} from '../types/error-response.type';
//утилиты
import { parseDuplicateError } from '../utils/error-parser.util';

// Логгер
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';

// Обработчики ошибок
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { FileTooLargeException } from '../exceptions/file-too-large.exception';

// @Catch() — ловим ВСЕ исключения
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  constructor(
    @Optional()
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly winston?: WinstonLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    //  дефолтные значения 500 ошибка
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    // 404 Обработка EntityNotFoundException кастом
    if (exception instanceof EntityNotFoundException) {
      status = exception.getStatus();
      message = exception.message;
    }

    // 413 Обработка PayloadTooLargeException загрузка (большие файлы)
    else if (exception instanceof FileTooLargeException) {
      status = exception.getStatus();
      message = exception.message;
    }

    // 404 нативно TypeORM EntityNotFoundError
    else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Not found';
    }

    // TypeORM QueryFailedError
    // 409 для дубликатов (23505)
    // 400 для всех остальных кодов
    else if (exception instanceof QueryFailedError) {
      const parsed = parseDuplicateError(exception);
      if (parsed) {
        status = parsed.status;
        message = parsed.message;
      }
    }

    //  Обработка всех остальных HttpException
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || exception.message;
      }
    }

    // Форимирую ответ в зависимости от окружения
    const isDev = process.env.NODE_ENV === 'dev';

    // Формируем сообщение для лога
    const logMessage = `${request.method} ${request.url} - Status: ${status} - Message: ${message}`;
    const stack = exception instanceof Error ? exception.stack : undefined;

    // Логируем через Winston если есть, иначе через NestJS Logger
    if (this.winston) {
      // Winston
      this.winston.error({
        message: logMessage,
        status,
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
        stack,
      });
    } else {
      // Fallback на NestJS Logger нативноый
      this.logger.error(logMessage, stack);
    }

    // Формируем ответ
    let responseBody: ErrorResponse | ErrorResponseDev;

    if (isDev) {
      responseBody = {
        statusCode: status,
        message: message,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      };
    } else {
      responseBody = {
        statusCode: status,
        message: message,
      };
    }
    response.status(status).json(responseBody);
  }
}
