import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Logger as WinstonLogger } from 'winston';
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly winston?;
    private readonly logger;
    constructor(winston?: WinstonLogger | undefined);
    catch(exception: unknown, host: ArgumentsHost): void;
}
