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
  NotFoundException,
} from '@nestjs/common';
import { VariantCategoryService } from './variantCategory.service';
import { CreateVariantCategoryDto } from './dto/create-variantCategory.dto';
import { UpdateVariantCategoryDto } from './dto/update-variantCategory.dto';
import { IVariantCategoryService } from './variantCategory.interface';
import { VariantCategory } from '@prisma/client';

@Controller('/variant-categories')
export class VariantCategoryController {
  constructor(
    @Inject(VariantCategoryService)
    private readonly variantCategoryService: IVariantCategoryService,
  ) {}

  @Post()
  async createVariantCategory(
    @Body() createVariantCategoryDto: CreateVariantCategoryDto,
  ): Promise<VariantCategory> {
    return this.variantCategoryService.createVariantCategory(
      createVariantCategoryDto,
    );
  }

  @Get()
  async getAllVariantCategories(): Promise<VariantCategory[]> {
    return this.variantCategoryService.getAllVariantCategories();
  }

  @Get('/:id')
  async getVariantCategoryById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VariantCategory> {
    return this.variantCategoryService.getVariantCategoryById(id);
  }

  @Get(':id/stock')
  async getStockByVariantCategory(@Param('id') id: string) {
    const numericId = parseInt(id, 10); // Convierte el ID a número
    const stockData =
      await this.variantCategoryService.getStockByVariantCategory(numericId);
    if (!stockData.length) {
      throw new NotFoundException(
        `No se encontraron datos de stock para la categoría de variante con ID ${numericId}.`,
      );
    }
    return stockData;
  }

  @Put('/:id')
  async updateVariantCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVariantCategoryDto: UpdateVariantCategoryDto,
  ): Promise<VariantCategory> {
    return this.variantCategoryService.updateVariantCategory(
      id,
      updateVariantCategoryDto,
    );
  }

  @Delete('/:id')
  async deleteVariantCategory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VariantCategory> {
    return this.variantCategoryService.deleteVariantCategory(id);
  }
}
