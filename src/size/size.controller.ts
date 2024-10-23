import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Put,
  Inject,
} from '@nestjs/common';
import { SizeService } from './size.service';
import { Product } from '@prisma/client';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { AssignSizeDto } from './dto/assign-size.dto';
import { ISizeService } from './size.interface';

@Controller('/size')
export class SizeController {
  constructor(
    @Inject(SizeService)
    private readonly size: ISizeService,
  ) {}

  // Metodo para obtener todos los tamaños registrados
  @Get()
  async getAllSizes() {
    return this.size.getAllSizes();
  }

  // Metodo para crear los tamaños
  @Post()
  async createSize(@Body() createSizeDto: CreateSizeDto) {
    return this.size.createSize(createSizeDto);
  }

  // Metodo para obtener los tamaños por id
  @Get('/:id')
  async getSizeById(@Param('id') id: string) {
    return this.size.getSizeById(Number(id));
  }

  // Metodo para asignarle un tamaño a un producto
  @Post('/:productId/assign-size')
  async assignSizeToProduct(
    @Param('productId') productId: number,
    @Body() assignSizeDto: AssignSizeDto,
  ): Promise<Product> {
    return this.size.assignSizeToProduct(assignSizeDto, Number(productId));
  }

  // Metodo para obtener el stock por tamaño
  @Get('/stock/:id')
  async getStockBySize(@Param('id') id: number) {
    return this.size.getStockBySize(Number(id));
  }

  // Metodo para borrar un tamaño
  @Delete('/:id')
  async deleteSize(@Param('id') id: string) {
    return this.size.deleteSize(Number(id));
  }

  // Metodo para actualizar un tamaño
  @Put('/:id')
  async updateSize(
    @Param('id') id: string,
    @Body() updateSizeDto: UpdateSizeDto,
  ) {
    return this.size.updateSize(Number(id), updateSizeDto);
  }
}
