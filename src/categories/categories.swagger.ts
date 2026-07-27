import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Category } from './entities/category.entity';

export function ApiCategoriesController() {
  return applyDecorators(ApiTags('Categories'), ApiExtraModels(Category));
}

export function ApiGetCategories() {
  return applyDecorators(
    ApiOperation({ summary: 'Get the category tree' }),
    ApiOkResponse({
      description: 'Root categories with nested children',
      type: Category,
      isArray: true,
    }),
  );
}

export function ApiGetCategory() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a category by ID' }),
    ApiParam({
      name: 'id',
      description: 'Category identifier',
      format: 'uuid',
    }),
    ApiOkResponse({
      description:
        'Category with its parent and direct children, or null if absent',
      schema: {
        allOf: [{ $ref: getSchemaPath(Category) }],
        nullable: true,
      },
    }),
  );
}

export function ApiCreateCategory() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a category (admin only)' }),
    ApiCreatedResponse({
      description: 'Category created successfully',
      type: Category,
    }),
    ApiBadRequestResponse({ description: 'Invalid request body' }),
    ApiForbiddenResponse({ description: 'Administrator access required' }),
  );
}

export function ApiUpdateCategory() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update a category (admin only)' }),
    ApiParam({
      name: 'id',
      description: 'Category identifier',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'Updated category, or null if absent',
      schema: {
        allOf: [{ $ref: getSchemaPath(Category) }],
        nullable: true,
      },
    }),
    ApiBadRequestResponse({ description: 'Invalid request body' }),
    ApiForbiddenResponse({ description: 'Administrator access required' }),
  );
}

export function ApiDeleteCategory() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a category (admin only)' }),
    ApiParam({
      name: 'id',
      description: 'Category identifier',
      format: 'uuid',
    }),
    ApiOkResponse({ description: 'Category deleted successfully' }),
    ApiForbiddenResponse({ description: 'Administrator access required' }),
  );
}
