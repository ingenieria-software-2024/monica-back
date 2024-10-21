import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '@prisma/client';

@Controller('/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategories() {
    return this.categoryService.getCategories();
  }

  @Get('/:id')
  async getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getCategoryById(id);
  }

  @Post('/create')
  async createCategory(@Body() data: Category) {
    return this.categoryService.createCategory(data.name, data.description);
  }

  @Put('/:id')
  async updateCategoryByid(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Category,
  ) {
    return this.categoryService.updateCategoryByid(id, data);
  }
}
