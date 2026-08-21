/**
 * Коды ошибок PostgreSQL (можно добавить если требуется другие коды)
 * @see https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
export const POSTGRES_ERROR_CODES = {
  /** Нарушение уникальности (duplicate key ) */
  UNIQUE_VIOLATION: '23505',
} as const;

export type PostgresErrorCode =
  (typeof POSTGRES_ERROR_CODES)[keyof typeof POSTGRES_ERROR_CODES];
