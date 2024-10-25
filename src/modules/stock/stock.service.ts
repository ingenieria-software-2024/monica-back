import { Prisma, ProductVariant } from '@prisma/client';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { IStockService } from './stock.interface';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma.service';

@Injectable()
export class StockService implements IStockService {
  readonly #logger = new Logger(StockService.name);

  /** Accesor para las operaciones CRUD de las variantes */
  readonly #variants: Prisma.ProductVariantDelegate;

  constructor(private readonly prisma: PrismaService) {
    this.#variants = prisma.productVariant;
  }

  /**
   * Crea una nueva variante
   * @param {CreateVariantDto} createVariantDto
   * @returns {Promise<ProductVariant>}
   */
  async createVariant(
    createVariantDto: CreateVariantDto,
  ): Promise<ProductVariant> {
    const productExists = await this.prisma.product.findUnique({
      where: { id: createVariantDto.productId }, // Usar productId del DTO
    });

    if (!productExists) {
      throw new NotFoundException(
        `Producto con ID ${createVariantDto.productId} no encontrado.`,
      );
    }

    // Asegúrate de que el DTO incluya variantCategoryId
    return await this.prisma.productVariant.create({
      data: {
        name: createVariantDto.name,
        stock: createVariantDto.stock,
        stockMin: createVariantDto.stockMin,
        description: createVariantDto.description,
        product: {
          connect: {
            id: createVariantDto.productId, // Usar productId del DTO
          },
        },
        variantCategory: {
          // Asegúrate de incluir el ID de la categoría de variante
          connect: {
            id: createVariantDto.variantCategoryId, // Asegúrate de que este ID esté en tu DTO
          },
        },
      },
    });
  }

  /**
   * Obtener listado de todas las variantes
   * @returns {Promise<ProductVariant[]>}
   */
  async getAllVariants(): Promise<ProductVariant[]> {
    return await this.prisma.productVariant.findMany({
      include: {
        variantCategory: {
          // Incluir la categoría de variante
          select: {
            name: true, // Obtener solo el nombre
          },
        },
      },
    });
  }

  /**
   * Busca una variante por su identificador.
   * @param {number} id
   * @returns {Promise<ProductVariant>}
   */
  async getVariantById(id: number): Promise<ProductVariant> {
    try {
      return await this.prisma.productVariant.findUnique({
        where: { id },
        include: {
          variantCategory: {
            // Incluir la categoría de variante
            select: {
              name: true, // Obtener solo el nombre
            },
          },
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        throw new NotFoundException(`No se encontró la variante con ID: ${id}`);
      this.#logger.error(`Failed to search variant by ID ${id}: ${e}`);
    }
  }

  /**
   * Actualizar una variante registrada
   * @param {number} id
   * @param {UpdateVariantDto} updateVariantDto
   * @returns {Promise<ProductVariant>}
   */
  async updateVariant(
    id: number,
    updateVariantDto: UpdateVariantDto,
  ): Promise<ProductVariant> {
    return this.prisma.productVariant.update({
      where: { id },
      data: {
        ...(updateVariantDto.name && { name: updateVariantDto.name }),
        ...(updateVariantDto.description && {
          description: updateVariantDto.description,
        }),
        ...(updateVariantDto.stock !== undefined && {
          stock: updateVariantDto.stock,
        }),
        ...(updateVariantDto.stockMin !== undefined && {
          stockMin: updateVariantDto.stockMin,
        }),
        ...(updateVariantDto.productId && {
          productId: updateVariantDto.productId,
        }), // Agregar productId
        ...(updateVariantDto.variantCategoryId && {
          variantCategoryId: updateVariantDto.variantCategoryId, // Agregar variantCategoryId
        }),
      },
    });
  }

  /**
   * Borrar alguna variante existente
   * @param {number} id
   * @returns {Promise<ProductVariant>}
   */
  async deleteVariant(id: number): Promise<ProductVariant> {
    return await this.prisma.productVariant.delete({
      where: { id },
    });
  }
}
