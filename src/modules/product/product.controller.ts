import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';

@Controller('/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

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
    return this.productService.getProducts();
  }

  @Get('/:id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(parseInt(id));
  }

  @Put('/:id')
  async updateProduct(@Param('id') id: string, @Body() data: Product) {
    return this.productService.updateProductById(parseInt(id), data);
  }
}
