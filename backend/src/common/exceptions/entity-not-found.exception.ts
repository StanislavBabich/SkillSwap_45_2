// Not Found

import { HttpException, HttpStatus } from '@nestjs/common';
/**
 * @param entityName - Название сущности подставить (юзер, скилл или что угодно что не нашлось)
 * @param id - (опционально) Идентификатор сущности
 * @example
 * // Поиск по ID юзера
 * throw new EntityNotFoundException('User', 123);
 * // → "User with ID 123 not found" (404)
 */

export class EntityNotFoundException extends HttpException {
  constructor(entityName: string, id?: string | number) {
    const message = id
      ? `${entityName} with ID ${id} not found`
      : `${entityName} not found`;

    super(message, HttpStatus.NOT_FOUND);
  }
}
