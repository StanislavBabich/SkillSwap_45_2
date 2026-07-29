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
exports.Category = void 0;
const skill_entity_1 = require("../../skills/entities/skill.entity");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let Category = class Category {
    id;
    name;
    parent;
    children;
    skills;
    createdAt;
    updatedAt;
};
exports.Category = Category;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique category identifier',
        example: '550e8400-e29b-41d4-a716-446655440000',
        format: 'uuid',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Category.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category name', example: 'Programming' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Parent category',
        type: () => Category,
        nullable: true,
        example: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Development',
            createdAt: '2026-07-23T12:00:00.000Z',
            updatedAt: '2026-07-23T12:00:00.000Z',
        },
    }),
    (0, typeorm_1.ManyToOne)(() => Category, (category) => category.children, {
        nullable: true,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Object)
], Category.prototype, "parent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Nested categories',
        type: () => Category,
        isArray: true,
        example: [
            {
                id: '6ba7b810-9dad-41d1-80b4-00c04fd430c8',
                name: 'Backend development',
                createdAt: '2026-07-23T12:00:00.000Z',
                updatedAt: '2026-07-23T12:00:00.000Z',
            },
        ],
    }),
    (0, typeorm_1.OneToMany)(() => Category, (category) => category.parent),
    __metadata("design:type", Array)
], Category.prototype, "children", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, typeorm_1.OneToMany)(() => skill_entity_1.Skill, (skill) => skill.category),
    __metadata("design:type", Array)
], Category.prototype, "skills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category creation timestamp',
        example: '2026-07-23T12:00:00.000Z',
        format: 'date-time',
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Category.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category last update timestamp',
        example: '2026-07-23T12:00:00.000Z',
        format: 'date-time',
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Category.prototype, "updatedAt", void 0);
exports.Category = Category = __decorate([
    (0, typeorm_1.Entity)('categories')
], Category);
//# sourceMappingURL=category.entity.js.map