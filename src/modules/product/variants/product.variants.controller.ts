import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Inject,
} from '@nestjs/common';
import { ProductVariantService } from './product.variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { IProductVariantService } from './product.variants.interface';

@Controller('/products/variants')
export class ProductVariantController {
  constructor(
    @Inject(ProductVariantService)
    private readonly service: IProductVariantService,
  ) {}

  @Post()
  async createVariant(@Body() createVariantDto: CreateVariantDto) {
    return this.service.createVariant(createVariantDto);
  }

  @Get()
  async getAllVariants() {
    return this.service.getAllVariants();
  }

  @Get('/:id')
  async getVariantById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getVariantById(id);
  }

  @Put('/:id')
  async updateVariant(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVariantDto: UpdateVariantDto,
  ) {
    return this.service.updateVariant(id, updateVariantDto);
  }

  @Delete('/:id')
  async deleteVariant(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteVariant(id);
  }
}
