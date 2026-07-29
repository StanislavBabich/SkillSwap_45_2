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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
class RegisterDto {
    email;
    password;
    name;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Некорректный email' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email обязателен' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: 'Пароль должен быть минимум 6 символов' }),
    (0, class_validator_1.MaxLength)(20, { message: 'Пароль не должен превышать 20 символов' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Пароль обязателен' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: 'Имя должно содержать минимум 2 символа' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Имя не должно превышать 50 символов' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Имя обязательно' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
//# sourceMappingURL=register.dto.js.map