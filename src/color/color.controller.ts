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
import { ColorService } from './color.service';
import { Product } from '@prisma/client';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { AssignColorDto } from './dto/assign-color.dto';
import { IColorService } from './color.interface';

@Controller('/color')
export class ColorController {
  constructor(
    @Inject(ColorService)
    private readonly color: IColorService,
  ) {}

  // Metodo para obtener todos los colores registrados
  @Get()
  async getAllColors() {
    return this.color.getAllColors();
  }

  // Método para crear un color
  @Post()
  async createColor(@Body() createColorDto: CreateColorDto) {
    return this.color.createColor(createColorDto);
  }

  // Método para obtener los colores por id
  @Get('/:id')
  async getColorById(@Param('id') id: string) {
    return this.color.getColorById(Number(id));
  }

  // Método para asignarle un color a un producto
  @Post('/:productId/assign-color')
  async assignColorToProduct(
    @Param('productId') productId: string,
    @Body() assignColorDto: AssignColorDto,
  ): Promise<Product> {
    return this.color.assignColorToProduct(
      assignColorDto,
      Number(productId),
    );
  }

  // Método para obtener el stock por color
  @Get('/stock/:id')
  async getStockByColor(@Param('id') id: number) {
    return this.color.getStockByColor(Number(id));
  }

  // Método para borrar un color
  @Delete('/:id')
  async deleteColor(@Param('id') id: string) {
    return this.color.deleteColor(Number(id));
  }

  // Método para actualizar un color
  @Put('/:id')
  async updateColor(
    @Param('id') id: string,
    @Body() updateColorDto: UpdateColorDto,
  ) {
    return this.color.updateColor(Number(id), updateColorDto);
  }
}
