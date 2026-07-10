import { QueryFailedError } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { POSTGRES_ERROR_CODES } from '../../utils/constans';
/**
 * Результат парсинга ошибки дубликата
 */
interface DuplicateErrorResult {
  status: number;
  message: string;
}

export interface DriverError {
  code?: string;
  detail?: string;
  table?: string;
  constraint?: string;
}

/**
 * Парсит ошибку TypeORM QueryFailedError для кода 23505 (duplicate key)
 *
 * @param exception - Ошибка TypeORM
 * @returns Объект со статусом и сообщением, или null если не дубликат
 *
 * @example
 * const error = new QueryFailedError(...);
 * const result = parseDuplicateError(error);
 * // { status: 409, message: "Duplicate key error: email 'john@example.com' already exists" }
 */
export function parseDuplicateError(
  exception: unknown,
): DuplicateErrorResult | null {
  // Проверяем, что это QueryFailedError
  if (!(exception instanceof QueryFailedError)) {
    return null;
  }

  const errorWithDriver = exception as unknown as { driverError?: DriverError };
  const driverError = errorWithDriver.driverError;

  // Проверяем код ошибки 23505 из PostgreSQL
  if (driverError?.code !== POSTGRES_ERROR_CODES.UNIQUE_VIOLATION) {
    return {
      status: HttpStatus.BAD_REQUEST,
      message: 'Database error: invalid data',
    };
  }

  // Извлекаем детали ошибки
  const detail = driverError.detail || '';

  // Парсим поле и значение
  const { fieldName, fieldValue } = extractFieldData(detail);

  // Формируем читаемое сообщение
  const message =
    fieldName && fieldValue
      ? `Duplicate key error: ${fieldName} '${fieldValue}' already exists`
      : 'Duplicate key error: such record already exists';

  return {
    status: HttpStatus.CONFLICT,
    message,
  };
}

/**
 * Извлекает название поля и значение из сообщения PostgreSQL
 *
 * @param detail - detail из driverError PostgreSQL
 * @returns Объект с полем и значением
 *
 * @example
 * // Вход: `Key (email)=(john@example.com) already exists.`
 * // Выход: { fieldName: 'email', fieldValue: 'john@example.com' }
 */
function extractFieldData(detail: string): {
  fieldName: string | null;
  fieldValue: string | null;
} {
  // Регулярка для поля: Key (email)
  const fieldNameRegex = /(?<=Key \()\w+/;
  // Регулярка для значения: (john@example.com)
  const fieldValueRegex = /(?<=\)=\().*?(?=\))/;

  const fieldNameMatch = detail.match(fieldNameRegex);
  const fieldValueMatch = detail.match(fieldValueRegex);

  return {
    fieldName: fieldNameMatch?.[0] || null,
    fieldValue: fieldValueMatch?.[0] || null,
  };
}
