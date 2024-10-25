import {
  Prisma,
  Product,
  ProductVariant,
  VariantCategory,
} from '@prisma/client';
import { CreateVariantCategoryDto } from './dto/create-variantCategory.dto';
import { UpdateVariantCategoryDto } from './dto/update-variantCategory.dto';
import { IVariantCategoryService } from './variantCategory.interface';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma.service';

@Injectable()
export class VariantCategoryService implements IVariantCategoryService {
  private readonly logger = new Logger(VariantCategoryService.name);

  /** Accesor para las operaciones CRUD de las categorías de variantes */
  readonly #categories: Prisma.VariantCategoryDelegate;

  constructor(private readonly prisma: PrismaService) {
    this.#categories = prisma.variantCategory;
  }

  /**
   * Crea una nueva categoría de variante.
   * @param {CreateVariantCategoryDto} createVariantCategoryDto
   * @returns {Promise<VariantCategory>}
   */
  async createVariantCategory(
    createVariantCategoryDto: CreateVariantCategoryDto,
  ): Promise<VariantCategory> {
    // Si el ID está presente, podría ser un intento de actualizar
    if (createVariantCategoryDto.id) {
      // Manejar actualización lógica aquí, si es necesario.
      throw new Error(
        'El ID no debe ser proporcionado al crear una nueva categoría de variante.',
      );
    }

    // Crear la nueva categoría de variante
    return this.prisma.variantCategory.create({
      data: {
        name: createVariantCategoryDto.name,
        description: createVariantCategoryDto.description,
      },
    });
  }

  /**
   * Obtener listado de todas las categorías de variantes.
   * @returns {Promise<VariantCategory[]>}
   */
  async getAllVariantCategories(): Promise<VariantCategory[]> {
    return this.prisma.variantCategory.findMany();
  }

  /**
   * Busca una categoría de variante por su identificador.
   * @param {number} id
   * @returns {Promise<VariantCategory>}
   */
  async getVariantCategoryById(id: number): Promise<VariantCategory> {
    const category = await this.prisma.variantCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(
        `No se encontró la categoría de variante con ID: ${id}`,
      );
    }

    return category;
  }

  /**
   * Obtiene el stock por categoría de variante.
   *
   * @param {number} id El ID de la categoría de variante.
   * @returns {Promise<{
   *   variantCategory: VariantCategory;
   *   productVariant: ProductVariant;
   *   product: Product;
   *   stock: number;}[]>}
   */
  async getStockByVariantCategory(id: number): Promise<
    {
      variantCategory: VariantCategory;
      productVariant: ProductVariant;
      product: Product;
      stock: number;
    }[]
  > {
    const variantCategories = await this.prisma.variantCategory.findMany({
      where: { id },
      include: {
        ProductVariant: {
          include: {
            product: true, // Incluir los productos asociados a la variante
          },
        },
      },
    });

    if (!variantCategories.length) {
      throw new NotFoundException(
        `No se encontró la categoría de variante con ID ${id}`,
      );
    }

    return variantCategories
      .map((variantCategory) => {
        return variantCategory.ProductVariant.map((productVariant) => ({
          variantCategory: {
            id: variantCategory.id,
            name: variantCategory.name,
            description: variantCategory.description,
          },
          productVariant: {
            id: productVariant.id,
            name: productVariant.name,
            description: productVariant.description,
            stock: productVariant.stock,
            stockMin: productVariant.stockMin,
            productId: productVariant.productId,
            variantCategoryId: productVariant.variantCategoryId,
          },
          product: productVariant.product, // Agrega el producto asociado
          stock: productVariant.stock,
        }));
      })
      .flat(); // Utiliza flat() para aplanar el array
  }

  /**
   * Actualizar una categoría de variante registrada.
   * @param {number} id
   * @param {UpdateVariantCategoryDto} updateVariantCategoryDto
   * @returns {Promise<VariantCategory>}
   */
  async updateVariantCategory(
    id: number,
    updateVariantCategoryDto: UpdateVariantCategoryDto,
  ): Promise<VariantCategory> {
    const categoryExists = await this.getVariantCategoryById(id); // Verificar si existe

    return this.prisma.variantCategory.update({
      where: { id: categoryExists.id },
      data: {
        ...(updateVariantCategoryDto.name && {
          name: updateVariantCategoryDto.name,
        }),
        ...(updateVariantCategoryDto.description && {
          description: updateVariantCategoryDto.description,
        }),
      },
    });
  }

  /**
   * Borrar alguna categoría de variante existente.
   * @param {number} id
   * @returns {Promise<VariantCategory>}
   */
  async deleteVariantCategory(id: number): Promise<VariantCategory> {
    const categoryExists = await this.getVariantCategoryById(id); // Verificar si existe

    return this.prisma.variantCategory.delete({
      where: { id: categoryExists.id },
    });
  }
}
