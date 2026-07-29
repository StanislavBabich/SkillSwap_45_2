"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCategoriesController = ApiCategoriesController;
exports.ApiGetCategories = ApiGetCategories;
exports.ApiGetCategory = ApiGetCategory;
exports.ApiCreateCategory = ApiCreateCategory;
exports.ApiUpdateCategory = ApiUpdateCategory;
exports.ApiDeleteCategory = ApiDeleteCategory;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const category_entity_1 = require("./entities/category.entity");
function ApiCategoriesController() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)('Categories'), (0, swagger_1.ApiExtraModels)(category_entity_1.Category));
}
function ApiGetCategories() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get the category tree' }), (0, swagger_1.ApiOkResponse)({
        description: 'Root categories with nested children',
        type: category_entity_1.Category,
        isArray: true,
    }));
}
function ApiGetCategory() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get a category by ID' }), (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Category identifier',
        format: 'uuid',
    }), (0, swagger_1.ApiOkResponse)({
        description: 'Category with its parent and direct children, or null if absent',
        schema: {
            allOf: [{ $ref: (0, swagger_1.getSchemaPath)(category_entity_1.Category) }],
            nullable: true,
        },
    }));
}
function ApiCreateCategory() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Create a category (admin only)' }), (0, swagger_1.ApiCreatedResponse)({
        description: 'Category created successfully',
        type: category_entity_1.Category,
    }), (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid request body' }), (0, swagger_1.ApiForbiddenResponse)({ description: 'Administrator access required' }));
}
function ApiUpdateCategory() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Update a category (admin only)' }), (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Category identifier',
        format: 'uuid',
    }), (0, swagger_1.ApiOkResponse)({
        description: 'Updated category, or null if absent',
        schema: {
            allOf: [{ $ref: (0, swagger_1.getSchemaPath)(category_entity_1.Category) }],
            nullable: true,
        },
    }), (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid request body' }), (0, swagger_1.ApiForbiddenResponse)({ description: 'Administrator access required' }));
}
function ApiDeleteCategory() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Delete a category (admin only)' }), (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Category identifier',
        format: 'uuid',
    }), (0, swagger_1.ApiOkResponse)({ description: 'Category deleted successfully' }), (0, swagger_1.ApiForbiddenResponse)({ description: 'Administrator access required' }));
}
//# sourceMappingURL=categories.swagger.js.map