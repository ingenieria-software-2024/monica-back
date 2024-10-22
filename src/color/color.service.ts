import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IColorService } from './color.interface';
import { Color, Prisma, Product } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { AssignColorDto } from "./dto/assign-color.dto";

@Injectable()
export class ColorService implements IColorService {
  readonly #logger = new Logger(ColorService.name);

  /** Accesor para las operaciones CRUD de los colores. */
  readonly #colors: Prisma.ColorDelegate;

  constructor(private readonly prisma: PrismaService) {
    this.#colors = prisma.color;
  }

  // Método para obtener todos los colores
  async getAllColors(): Promise<Color[]> {
    return this.prisma.color.findMany();
  }

  // Método para obtener los colores por id
  async getColorById(id: number): Promise<Color> {
    try {
      return await this.#colors.findUnique({ where: { id } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        throw new NotFoundException(
          `No se encontro la categoria con ID: ${id}`,
        );
      this.#logger.error(`Failed to search category by ID ${id}: ${e}`);
    }
  }

  // Método para crear un color nuevo
  async createColor(createColorDto: CreateColorDto): Promise<Color> {
    return this.prisma.color.create({
      data: {
        name: createColorDto.name,
        stock: createColorDto.stock,
        stockMin: createColorDto.stockMin,
        description: createColorDto.description,
      },
    });
  }

  // Método para asignar un color existente a un producto
  async assignColorToProduct(
    assignColorDto: AssignColorDto, 
    productId: number,
  ): Promise<Product> {
    // Extraemos el colorId del DTO
    const { colorId } = assignColorDto; 

    // Convertir productId a número
    const numericProductId = Number(productId);

    // Verificar si el producto existe
    const product = await this.prisma.product.findUnique({
      where: { id: numericProductId },
    });

    if (!product) {
      throw new Error(`El producto con Id ${productId} no existe`);
    }

    // Verificar si el color existe
    const color = await this.prisma.color.findUnique({
      where: { id: colorId },
    });

    if (!color) {
      throw new Error(`El color con Id ${colorId} no existe`);
    }

    // Actualizar el producto para asignar el colorId al color existente
    const updatedProduct = await this.prisma.product.update({
      where: { id: numericProductId },
      data: { colorId: colorId },
      include: { color: true }, 
    });

    // Retornar el producto actualizado
    return updatedProduct;
  }

  // Método para obtener stock por color
  async getStockByColor(
    id: number,
  ): Promise<{ product: Product; stock: number }[]> {
    // Verificar si el color existe
    const color = await this.prisma.color.findUnique({
      where: { id: id },
    });

    if (!color) {
      throw new Error(`El color con Id ${id} no existe`);
    }

    // Busca todos los productos que tienen el color especificado
    const products = await this.prisma.product.findMany({
      where: {
        colorId: id,
      },
      include: {
        color: true,
      },
    });

    if (!products.length) {
      throw new Error(`No hay productos asociados al color con Id ${id}`);
    }

    // Retornar los productos junto con su stock asociado al color
    return products.map((product) => ({
      product,
      stock: product.color ? product.color.stock : 0, 
    }));
  }

  // Método para actualizar un color
  async updateColor(id: number, updateColorDto: UpdateColorDto): Promise<Color> {
    return this.prisma.color.update({
      where: {
        id,
      },
      data: {
        ...(updateColorDto.name && { name: updateColorDto.name }),
        ...(updateColorDto.description && { description: updateColorDto.description }),
        ...(updateColorDto.stock !== undefined && { stock: updateColorDto.stock }),
        ...(updateColorDto.stockMin !== undefined && { stockMin: updateColorDto.stockMin }),
      },
    });
  }

  // Método para borrar un color
  async deleteColor(id: number): Promise<Color> {
    return this.prisma.color.delete({
      where: {
        id,
      },
    });
  }
}
