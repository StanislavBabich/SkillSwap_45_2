"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTooLargeException = void 0;
const common_1 = require("@nestjs/common");
class FileTooLargeException extends common_1.HttpException {
    constructor(maxSize, actualSize) {
        const message = actualSize
            ? `File too large: ${actualSize}MB exceeds maximum size of ${maxSize}MB`
            : `File too large. Maximum file size is ${maxSize}MB`;
        super(message, common_1.HttpStatus.PAYLOAD_TOO_LARGE);
    }
}
exports.FileTooLargeException = FileTooLargeException;
//# sourceMappingURL=file-too-large.exception.js.map