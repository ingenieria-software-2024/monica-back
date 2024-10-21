import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '@prisma/client';
import { CreateCategoryDto } from './dto/create.category.dto';
import { ISubCategoryService } from './subcategory.interface';
import { ICategoryService } from './category.interface';
import { SubCategoryService } from './subcategory.service';

@Controller('/categories')
export class CategoryController {
  constructor(
    @Inject(CategoryService)
    private readonly category: ICategoryService,
    @Inject(SubCategoryService)
    private readonly subCategory: ISubCategoryService,
  ) {}

  @Get()
  async getCategories() {
    return this.category.getCategories();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(@Body() data: CreateCategoryDto) {
    return this.category.createCategory(data.name, data.description);
  }

  @Get('/:id')
  async getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.category.getCategoryById(id);
  }

  @Put('/:id')
  async updateCategoryByid(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Category,
  ) {
    return this.category.updateCategoryByid(id, data);
  }
}
