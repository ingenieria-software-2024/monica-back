import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ISizeService } from './size.interface';
import { Size, Prisma, Product } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { AssignSizeDto } from './dto/assign-size.dto';

@Injectable()
export class SizeService implements ISizeService {
  readonly #logger = new Logger(SizeService.name);

  /** Accesor para las operaciones CRUD de los tamaños. */
  readonly #sizes: Prisma.SizeDelegate;

  constructor(private readonly prisma: PrismaService) {
    this.#sizes = prisma.size;
  }

  // Metodo para obtener todos los tamaños
  async getAllSizes(): Promise<Size[]> {
    return this.prisma.size.findMany();
  }

  // Metodo para obtener los tamaños por id
  async getSizeById(id: number): Promise<Size> {
    try {
      return await this.#sizes.findUnique({ where: { id } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        throw new NotFoundException(
          `No se encontro la categoria con ID: ${id}`,
        );
      this.#logger.error(`Failed to search category by ID ${id}: ${e}`);
    }
  }

  // Metodo para crear un tamaño nuevo
  async createSize(createSizeDto: CreateSizeDto): Promise<Size> {
    return this.prisma.size.create({
      data: {
        name: createSizeDto.name,
        stock: createSizeDto.stock,
        stockMin: createSizeDto.stockMin,
        description: createSizeDto.description,
      },
    });
  }

  // Método para asignar un tamaño existente a un producto
  async assignSizeToProduct(
    assignSizeDto: AssignSizeDto,
    productId: number,
  ): Promise<Product> {
    // Extraer el sizeId del DTO
    const { sizeId } = assignSizeDto;

    // Convertir productId a número
    const numericProductId = Number(productId);

    // Verificar si el producto existe
    const product = await this.prisma.product.findUnique({
      where: { id: numericProductId },
    });

    if (!product) {
      throw new Error(`El producto con Id ${productId} no existe`);
    }

    // Verificar si el tamaño existe
    const size = await this.prisma.size.findUnique({
      where: { id: sizeId },
    });

    if (!size) {
      throw new Error(`El tamaño con Id ${sizeId} no existe`);
    }

    // Actualizar el producto para asignar el sizeId al tamaño existente
    const updatedProduct = await this.prisma.product.update({
      where: { id: numericProductId },
      data: { sizeId: sizeId },
      include: { size: true }, // Incluye la relación con Size
    });

    // Retornar el producto actualizado
    return updatedProduct;
  }

  async getStockBySize(
    id: number,
  ): Promise<{ product: Product; stock: number }[]> {
    // Verificar si el tamaño existe
    const size = await this.prisma.size.findUnique({
      where: { id: id },
    });

    if (!size) {
      throw new Error(`El tamaño con Id ${id} no existe`);
    }

    // Busca todos los productos que tienen el tamaño especificado
    const products = await this.prisma.product.findMany({
      where: {
        sizeId: id,
      },
      include: {
        size: true,
      },
    });

    if (!products.length) {
      throw new Error(`No hay productos asociados al color con Id ${id}`);
    }

    // Retornar los productos junto con su stock asociado al tamaño
    return products.map((product) => ({
      product,
      stock: product.size ? product.size.stock : 0,
    }));
  }

  // Método para actualizar un tamaño
  async updateSize(id: number, updateSizeDto: UpdateSizeDto): Promise<Size> {
    return this.prisma.size.update({
      where: {
        id,
      },
      data: {
        ...(updateSizeDto.name && { name: updateSizeDto.name }),
        ...(updateSizeDto.description && {
          description: updateSizeDto.description,
        }),
        ...(updateSizeDto.stock !== undefined && {
          stock: updateSizeDto.stock,
        }),
        ...(updateSizeDto.stockMin !== undefined && {
          stockMin: updateSizeDto.stockMin,
        }),
      },
    });
  }

  // Metodo para borrar un tamaño
  async deleteSize(id: number): Promise<Size> {
    return this.prisma.size.delete({
      where: {
        id,
      },
    });
  }
}
