import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Исключение для случая, когда загружаемый файл превышает лимит
 
 * @param maxSize - Максимальный размер файла (в мегабайтах)
 * @param actualSize - Фактический размер файла (в мегабайтах)
 *
 * @example
 * throw new FileTooLargeException(5, 10);
 * // → "File too large: 10MB exceeds maximum size of 5MB" (413)
 */
export class FileTooLargeException extends HttpException {
  constructor(maxSize: number, actualSize?: number) {
    const message = actualSize
      ? `File too large: ${actualSize}MB exceeds maximum size of ${maxSize}MB`
      : `File too large. Maximum file size is ${maxSize}MB`;

    super(message, HttpStatus.PAYLOAD_TOO_LARGE);
  }
}
