export type ErrorResponse = {
  statusCode: number;
  message: string;
};

// Расширенный тип ответа при ошибке для development окружения
export type ErrorResponseDev = ErrorResponse & {
  timestamp: string;
  path: string;
  method: string;
};
