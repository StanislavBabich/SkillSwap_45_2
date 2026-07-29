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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const crypto_1 = require("crypto");
const files_swagger_1 = require("./files.swagger");
const fileFilter = (_req, file, callback) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
        callback(new common_1.BadRequestException('Недопустимый формат файла. Разрешены: JPEG, PNG, GIF, WEBP'), false);
        return;
    }
    callback(null, true);
};
let FilesController = class FilesController {
    uploadFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('Файл не загружен');
        }
        return {
            url: `/uploads/${file.filename}`,
        };
    }
};
exports.FilesController = FilesController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, files_swagger_1.ApiUploadFile)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './public/uploads',
            filename: (req, file, callback) => {
                const uniqueName = (0, crypto_1.randomUUID)();
                const extension = (0, path_1.extname)(file.originalname);
                callback(null, `${uniqueName}${extension}`);
            },
        }),
        limits: {
            fileSize: 2 * 1024 * 1024,
        },
        fileFilter,
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FilesController.prototype, "uploadFile", null);
exports.FilesController = FilesController = __decorate([
    (0, files_swagger_1.ApiFilesController)(),
    (0, common_1.Controller)('files')
], FilesController);
//# sourceMappingURL=files.controller.js.map