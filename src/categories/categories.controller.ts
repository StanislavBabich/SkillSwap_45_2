import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Request } from 'express';
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

@ApiTags('Categories')
@ApiExtraModels(Category)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  private checkAdmin(req: Request) {
    const user = (req as unknown as Record<string, unknown>).user as
      Record<string, unknown> | undefined;
    if (user?.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Доступ запрещён: только для администратора',
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get the category tree' })
  @ApiOkResponse({
    description: 'Root categories with nested children',
    type: Category,
    isArray: true,
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiParam({
    name: 'id',
    description: 'Category identifier',
    format: 'uuid',
  })
  @ApiOkResponse({
    description:
      'Category with its parent and direct children, or null if absent',
    schema: {
      allOf: [{ $ref: getSchemaPath(Category) }],
      nullable: true,
    },
  })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a category (admin only)' })
  @ApiCreatedResponse({
    description: 'Category created successfully',
    type: Category,
  })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiForbiddenResponse({ description: 'Administrator access required' })
  create(@Req() req: Request, @Body() createCategoryDto: CreateCategoryDto) {
    this.checkAdmin(req);
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a category (admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Category identifier',
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'Updated category, or null if absent',
    schema: {
      allOf: [{ $ref: getSchemaPath(Category) }],
      nullable: true,
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiForbiddenResponse({ description: 'Administrator access required' })
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    this.checkAdmin(req);
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a category (admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Category identifier',
    format: 'uuid',
  })
  @ApiOkResponse({ description: 'Category deleted successfully' })
  @ApiForbiddenResponse({ description: 'Administrator access required' })
  remove(@Req() req: Request, @Param('id') id: string) {
    this.checkAdmin(req);
    return this.categoriesService.remove(id);
  }
}
