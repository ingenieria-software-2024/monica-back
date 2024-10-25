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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create.product.dto';
import { IProductService } from './product.interface';
import { UpdateProductDto } from './dto/update.producto.dto';

@Controller('/products')
export class ProductController {
  constructor(
    @Inject(ProductService)
    private readonly product: IProductService,
  ) {}

  @Get()
  async getProducts() {
    return this.product.getProducts();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createProduct(@Body() createProductDto: CreateProductDto) {
    // Usar el DTO directamente
    return this.product.createProduct(createProductDto);
  }

  @Get('/:id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.product.getProductById(id);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.product.updateProductById(id, updateProductDto);
  }
}
