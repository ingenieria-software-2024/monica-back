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
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Category, SubCategory } from '@prisma/client';
import { CreateCategoryDto } from './dto/create.category.dto';
import { CategoryService } from './category.service';
import { ICategoryService } from './category.interface';
import { ISubCategoryService } from './subcategory.interface';
import { SubCategoryService } from './subcategory.service';
import { AuthGuard } from 'src/pipes/auth/auth.guard';

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

  @Get('/:id')
  async getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.category.getCategoryById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  async createCategory(@Body() data: CreateCategoryDto) {
    return this.category.createCategory(data.name, data.description);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async updateCategoryByid(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Category,
  ) {
    return this.category.updateCategoryByid(id, data);
  }

  @Get('/:id/subcategories')
  async getSubCategoriesByCategoryId(
    @Param('id', ParseIntPipe) categoryId: number,
  ): Promise<Array<SubCategory>> {
    return this.subCategory.getSubCategoriesByParent(categoryId);
  }

  @Get('/:id/subcategories/:subId')
  async getSubCategoryById(
    @Param('subId', ParseIntPipe) subCategoryId: number,
  ): Promise<SubCategory> {
    return this.subCategory.getSubCategoryById(subCategoryId);
  }

  @Post('/:id/subcategories')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  async createSubCategory(
    @Param('id', ParseIntPipe) categoryId: number,
    @Body() data: CreateCategoryDto,
  ): Promise<SubCategory> {
    return this.subCategory.createSubCategory(
      data.name,
      categoryId,
      data.description,
    );
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteCategory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Category> {
    return this.category.deleteCategory(id);
  }
}
