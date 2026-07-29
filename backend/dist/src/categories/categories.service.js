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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("./entities/category.entity");
let CategoriesService = class CategoriesService {
    categoryRepository;
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async create(createCategoryDto) {
        const { name, parentId } = createCategoryDto;
        const category = this.categoryRepository.create({ name });
        if (parentId) {
            const parent = await this.categoryRepository.findOneBy({ id: parentId });
            if (parent) {
                category.parent = parent;
            }
        }
        return this.categoryRepository.save(category);
    }
    async findAll() {
        return this.categoryRepository.find({
            where: { parent: (0, typeorm_2.IsNull)() },
            relations: {
                children: {
                    children: true,
                },
            },
        });
    }
    async findOne(id) {
        return this.categoryRepository.findOne({
            where: { id },
            relations: {
                children: true,
                parent: true,
            },
        });
    }
    async update(id, updateCategoryDto) {
        await this.categoryRepository.update(id, updateCategoryDto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.categoryRepository.delete(id);
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map