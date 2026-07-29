import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';

const logsDir = path.join(process.cwd(), 'logs');

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context }) => {
          const ctx = typeof context === 'string' ? context : '';
          return `[${String(timestamp)}] ${String(level)}${ctx ? ` [${ctx}]` : ''}: ${String(message)}`;
        }),
      ),
    }),
    new winston.transports.File({
      dirname: logsDir,
      filename: 'application.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      dirname: logsDir,
      filename: 'errors.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});
