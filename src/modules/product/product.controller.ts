import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';

@Controller('/products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  /*     @Post('create')
    async createProduct(@Body() data: Product) {
        return this.productService.createProduct(
        data.name, 
        data.price, 
        data.imageUrl, 
        data.categoryId, 
        true,//data.subCategoryId No se como pasar de un Number a un Boolean
        data.description 
        );
    }
 */
  @Get()
  async getProducts() {
    return this.service.getProducts();
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
