"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiFilesController = ApiFilesController;
exports.ApiUploadFile = ApiUploadFile;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const file_upload_response_dto_1 = require("./dto/file-upload-response.dto");
function ApiFilesController() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)('Files'));
}
function ApiUploadFile() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Upload an image' }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
        description: 'Image file in JPEG, PNG, GIF, or WEBP format. Maximum size: 2 MB.',
        schema: {
            type: 'object',
            required: ['file'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image file to upload',
                },
            },
        },
    }), (0, swagger_1.ApiCreatedResponse)({
        description: 'Image uploaded successfully',
        type: file_upload_response_dto_1.FileUploadResponseDto,
    }), (0, swagger_1.ApiBadRequestResponse)({
        description: 'File is missing or has an unsupported format',
    }), (0, swagger_1.ApiPayloadTooLargeResponse)({
        description: 'File exceeds the 2 MB size limit',
    }));
}
//# sourceMappingURL=files.swagger.js.map