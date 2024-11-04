import { Prisma, ProductVariant } from '@prisma/client';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { IProductVariantService } from './product.variants.interface';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma.service';

@Injectable()
export class ProductVariantService implements IProductVariantService {
  readonly #logger = new Logger(ProductVariantService.name);

  /** Accesor para las operaciones CRUD de las variantes */
  readonly #variants: Prisma.ProductVariantDelegate;
  readonly #products: Prisma.ProductDelegate;

  constructor(private readonly prisma: PrismaService) {
    this.#variants = prisma.productVariant;
    this.#products = prisma.product;
  }

  async createVariant(
    createVariantDto: CreateVariantDto,
  ): Promise<ProductVariant> {
    const productExists = await this.#products.findUnique({
      where: { id: createVariantDto.productId }, // Usar productId del DTO
    });

    if (!productExists) {
      throw new NotFoundException(
        `Producto con ID ${createVariantDto.productId} no encontrado.`,
      );
    }

    // Asegúrate de que el DTO incluya variantCategoryId
    return await this.#variants.create({
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

  async getAllVariants(): Promise<ProductVariant[]> {
    return await this.#variants.findMany({
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

  async getVariantById(id: number): Promise<ProductVariant> {
    const variant = await this.#variants.findUnique({
      where: { id },
      include: {
        variantCategory: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!variant) {
      throw new NotFoundException(`No se encontró la variante con ID: ${id}`);
    }

    return variant;
  }

  async getVariantsByProductId(
    productId: number,
  ): Promise<Array<ProductVariant>> {
    return await this.#variants.findMany({
      where: { productId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        variantCategory: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async updateVariant(
    id: number,
    updateVariantDto: UpdateVariantDto,
  ): Promise<ProductVariant> {
    // Parsear campos de DTO definidos.
    const data: Prisma.ProductVariantUpdateInput = {
      name: updateVariantDto?.name ?? Prisma.skip,
      description: updateVariantDto?.description ?? Prisma.skip,
      stock: updateVariantDto?.stock ?? Prisma.skip,
      stockMin: updateVariantDto?.stockMin ?? Prisma.skip,
    };

    return this.#variants.update({
      where: { id },
      data,
    });
  }

  async deleteVariant(id: number): Promise<ProductVariant> {
    return await this.#variants.delete({
      where: { id },
    });
  }
}
