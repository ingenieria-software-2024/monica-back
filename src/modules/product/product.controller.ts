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
import { ProductService } from './product.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create.product.dto';

@Controller('/products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get()
  async getProducts() {
    return this.service.getProducts();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createProduct(@Body() data: CreateProductDto) {
    // Destructurar información del DTO.
    const { name, price, imageUrl, categoryId, isSubCategory, description } =
      data;

    return this.service.createProduct(
      name,
      price,
      imageUrl,
      categoryId,
      isSubCategory,
      description,
    );
  }

  @Get('/:id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getProductById(id);
  }

  @Put('/:id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Product,
  ) {
    return this.service.updateProductById(id, data);
  }
}
