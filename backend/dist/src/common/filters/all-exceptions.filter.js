"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const error_parser_util_1 = require("../utils/error-parser.util");
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
const entity_not_found_exception_1 = require("../exceptions/entity-not-found.exception");
const file_too_large_exception_1 = require("../exceptions/file-too-large.exception");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    winston;
    logger = new common_1.Logger(AllExceptionsFilter_1.name);
    constructor(winston) {
        this.winston = winston;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';
        if (exception instanceof entity_not_found_exception_1.EntityNotFoundException) {
            status = exception.getStatus();
            message = exception.message;
        }
        else if (exception instanceof file_too_large_exception_1.FileTooLargeException) {
            status = exception.getStatus();
            message = exception.message;
        }
        else if (exception instanceof typeorm_1.EntityNotFoundError) {
            status = common_1.HttpStatus.NOT_FOUND;
            message = 'Not found';
        }
        else if (exception instanceof typeorm_1.QueryFailedError) {
            const parsed = (0, error_parser_util_1.parseDuplicateError)(exception);
            if (parsed) {
                status = parsed.status;
                message = parsed.message;
            }
        }
        else if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            }
            else if (typeof exceptionResponse === 'object' &&
                exceptionResponse !== null) {
                const responseObj = exceptionResponse;
                message = responseObj.message || exception.message;
            }
        }
        const isDev = process.env.NODE_ENV === 'dev';
        const logMessage = `${request.method} ${request.url} - Status: ${status} - Message: ${message}`;
        const stack = exception instanceof Error ? exception.stack : undefined;
        if (this.winston) {
            this.winston.error({
                message: logMessage,
                status,
                path: request.url,
                method: request.method,
                timestamp: new Date().toISOString(),
                stack,
            });
        }
        else {
            this.logger.error(logMessage, stack);
        }
        let responseBody;
        if (isDev) {
            responseBody = {
                statusCode: status,
                message: message,
                timestamp: new Date().toISOString(),
                path: request.url,
                method: request.method,
            };
        }
        else {
            responseBody = {
                statusCode: status,
                message: message,
            };
        }
        response.status(status).json(responseBody);
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [winston_1.Logger])
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map