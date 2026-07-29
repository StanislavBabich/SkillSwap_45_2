import { HttpException } from '@nestjs/common';
export declare class FileTooLargeException extends HttpException {
    constructor(maxSize: number, actualSize?: number);
}
