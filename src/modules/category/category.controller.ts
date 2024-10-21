import {
  Body,
  Controller,
  Get,
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

@Controller('/categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get()
  async getCategories() {
    return this.service.getCategories();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(@Body() data: CreateCategoryDto) {
    return this.service.createCategory(data.name, data.description);
  }

  @Get('/:id')
  async getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getCategoryById(id);
  }

  @Put('/:id')
  async updateCategoryByid(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Category,
  ) {
    return this.service.updateCategoryByid(id, data);
  }
}
