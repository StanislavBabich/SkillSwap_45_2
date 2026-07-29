"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDuplicateError = parseDuplicateError;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const constans_1 = require("../../utils/constans");
function parseDuplicateError(exception) {
    if (!(exception instanceof typeorm_1.QueryFailedError)) {
        return null;
    }
    const errorWithDriver = exception;
    const driverError = errorWithDriver.driverError;
    if (driverError?.code !== constans_1.POSTGRES_ERROR_CODES.UNIQUE_VIOLATION) {
        return {
            status: common_1.HttpStatus.BAD_REQUEST,
            message: 'Database error: invalid data',
        };
    }
    const detail = driverError.detail || '';
    const { fieldName, fieldValue } = extractFieldData(detail);
    const message = fieldName && fieldValue
        ? `Duplicate key error: ${fieldName} '${fieldValue}' already exists`
        : 'Duplicate key error: such record already exists';
    return {
        status: common_1.HttpStatus.CONFLICT,
        message,
    };
}
function extractFieldData(detail) {
    const fieldNameRegex = /(?<=Key \()\w+/;
    const fieldValueRegex = /(?<=\)=\().*?(?=\))/;
    const fieldNameMatch = detail.match(fieldNameRegex);
    const fieldValueMatch = detail.match(fieldValueRegex);
    return {
        fieldName: fieldNameMatch?.[0] || null,
        fieldValue: fieldValueMatch?.[0] || null,
    };
}
//# sourceMappingURL=error-parser.util.js.map