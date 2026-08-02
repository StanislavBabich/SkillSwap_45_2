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
exports.User = void 0;
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const skill_entity_1 = require("../../skills/entities/skill.entity");
const category_entity_1 = require("../../categories/entities/category.entity");
const request_entity_1 = require("../../requests/entities/request.entity");
const user_enums_1 = require("../user.enums");
let User = class User {
    id;
    name;
    email;
    password;
    about;
    birthdate;
    city;
    gender;
    avatar;
    skills;
    wantToLearn;
    sentRequests;
    receivedRequests;
    favoriteSkills;
    role = user_enums_1.UserRole.USER;
    refreshToken;
};
exports.User = User;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Alex Smith' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'alex@example.com', format: 'email' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Backend developer', nullable: true }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "about", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '1995-05-20',
        format: 'date',
        nullable: true,
    }),
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "birthdate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Moscow', nullable: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: user_enums_1.UserGender, nullable: true }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: user_enums_1.UserGender,
        enumName: 'user_gender_enum',
        nullable: true,
    }),
    __metadata("design:type", Object)
], User.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'https://example.com/avatar.jpg',
        format: 'uri',
        nullable: true,
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, typeorm_1.OneToMany)(() => skill_entity_1.Skill, (skill) => skill.owner),
    __metadata("design:type", Array)
], User.prototype, "skills", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Категории, которым пользователь хочет научиться',
    }),
    (0, typeorm_1.ManyToMany)(() => category_entity_1.Category),
    (0, typeorm_1.JoinTable)({
        name: 'users_want_to_learn',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'category_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], User.prototype, "wantToLearn", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, typeorm_1.OneToMany)(() => request_entity_1.Request, (request) => request.sender),
    __metadata("design:type", Array)
], User.prototype, "sentRequests", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, typeorm_1.OneToMany)(() => request_entity_1.Request, (request) => request.receiver),
    __metadata("design:type", Array)
], User.prototype, "receivedRequests", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, typeorm_1.ManyToMany)(() => skill_entity_1.Skill),
    (0, typeorm_1.JoinTable)({
        name: 'users_favorite_skills',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'skill_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], User.prototype, "favoriteSkills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: user_enums_1.UserRole, default: user_enums_1.UserRole.USER }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: user_enums_1.UserRole,
        enumName: 'user_role_enum',
        default: user_enums_1.UserRole.USER,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)({
        name: 'refresh_token',
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", Object)
], User.prototype, "refreshToken", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map