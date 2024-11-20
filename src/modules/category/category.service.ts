import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma.service';
import { ICategoryService } from './category.interface';
import { Category, Prisma } from '@prisma/client';

@Injectable()
export class CategoryService implements ICategoryService {
  readonly #logger = new Logger(CategoryService.name);

  //Accesor para las operaciones CRUD de las categorias.
  readonly #categories: Prisma.CategoryDelegate;

  /** Accesor para las operaciones CRUD de las subcategorias. */
  readonly #subCategories: Prisma.SubCategoryDelegate;

  constructor(private readonly prisma: PrismaService) {
    this.#categories = prisma.category;
    this.#subCategories = prisma.subCategory;
  }

  async createCategory(name: string, description?: string): Promise<Category> {
    try {
      const category: Prisma.CategoryCreateInput = {
        name,
        description,
      };

      return await this.#categories.create({ data: category });
    } catch (error) {
      this.#logger.error(`Error al crear la categoría: ${error}`);
      throw error;
    }
  }

  async getCategories(): Promise<Array<Category>> {
    try {
      return await this.#categories.findMany({
        where: { isDeleted: false },
      });
    } catch (e) {
      this.#logger.error(`Error al obtener las categorías: ${e}`);
      throw e;
    }
  }

  async getCategoryById(id: number): Promise<Category> {
    try {
      const category = await this.#categories.findUnique({
        where: { id, isDeleted: false },
      });

      if (!category) {
        throw new NotFoundException(
          `No se encontró la categoría con ID: ${id}`,
        );
      }
      return category;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        throw new NotFoundException(
          `No se encontró la categoría con ID: ${id}`,
        );

      this.#logger.error(`Failed to search category by ID ${id}: ${e}`);
      throw e;
    }
  }

  async updateCategoryByid(id: number, data: Category) {
    try {
      const category = await this.getCategoryById(id);

      if (!category) {
        throw new NotFoundException(
          `No se encontró la categoría con ID: ${id}`,
        );
      }

      return await this.#categories.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
        },
      });
    } catch (e) {
      this.#logger.error(`Error al actualizar la categoría ${id}: ${e}`);
      throw e;
    }
  }

  async deleteCategory(id: number): Promise<Category> {
    try {
      // Verificar si la categoría existe
      const category = await this.getCategoryById(id);

      if (!category)
        throw new NotFoundException(
          `No se encontró la categoría con ID: ${id}`,
        );

      // Obtener todas las subcategorías de esta categoría
      const subCategories = await this.#subCategories.findMany({
        where: {
          categoryId: id,
          isDeleted: false,
        },
      });

      // Eliminar lógicamente todas las subcategorías
      if (subCategories && subCategories.length > 0) {
        for (const subCategory of subCategories)
          await this.#subCategories.update({
            where: { id: subCategory.id },
            data: { isDeleted: true },
          });
      }

      // Realizar el borrado lógico de la categoría
      return await this.#categories.update({
        where: { id, isDeleted: false },
        data: { isDeleted: true },
      });
    } catch (e) {
      this.#logger.error(`Error al eliminar la categoría ${id}: ${e}`);
      throw e;
    }
  }
}
