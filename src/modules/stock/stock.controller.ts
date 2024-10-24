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
import { StockService } from './stock.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { IStockService } from './stock.interface';

@Controller('/variants')
export class StockController {
  constructor(
    @Inject(StockService)
    private readonly stockService: IStockService,
  ) {}

  @Post()
  async createVariant(@Body() createVariantDto: CreateVariantDto) {
    return this.stockService.createVariant(createVariantDto);
  }


  @Get()
  async getAllVariants() {
    return this.stockService.getAllVariants();
  }

  @Get('/:id')
  async getVariantById(@Param('id', ParseIntPipe) id: number) {
    return this.stockService.getVariantById(id);
  }

  @Put('/:id')
  async updateVariant(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVariantDto: UpdateVariantDto,
  ) {
    return this.stockService.updateVariant(id, updateVariantDto);
  }

  @Delete('/:id')
  async deleteVariant(@Param('id', ParseIntPipe) id: number) {
    return this.stockService.deleteVariant(id);
  }
}
