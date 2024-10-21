import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
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
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(Number(id));
  }

  @Post('/create')
  async createCategory(@Body() data: Category) {
    return this.categoryService.createCategory(data.name, data.description);
  }
  @Put('/:id')
  async updateCategoryByid(@Param('id') id: string, @Body() data: Category) {
    return this.categoryService.updateCategoryByid(parseInt(id), data);
  }
}
