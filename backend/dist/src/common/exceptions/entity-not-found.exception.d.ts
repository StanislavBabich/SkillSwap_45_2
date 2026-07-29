import { HttpException } from '@nestjs/common';
export declare class EntityNotFoundException extends HttpException {
    constructor(entityName: string, id?: string | number);
}
