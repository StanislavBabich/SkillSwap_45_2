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
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  create(@Req() req: Request, @Body() createCategoryDto: CreateCategoryDto) {
    this.checkAdmin(req);
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    this.checkAdmin(req);
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    this.checkAdmin(req);
    return this.categoriesService.remove(id);
  }
}
