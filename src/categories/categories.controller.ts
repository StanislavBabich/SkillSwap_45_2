import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiCategoriesController,
  ApiCreateCategory,
  ApiDeleteCategory,
  ApiGetCategories,
  ApiGetCategory,
  ApiUpdateCategory,
} from './categories.swagger';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/user.enums';

@ApiCategoriesController()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiGetCategories()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiGetCategory()
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @ApiCreateCategory()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch(':id')
  @ApiUpdateCategory()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiDeleteCategory()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
