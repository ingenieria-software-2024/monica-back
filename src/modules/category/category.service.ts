import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ICategoryService } from './category.interface';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma.service';

@Injectable()
export class CategoryService implements ICategoryService {
  readonly #logger = new Logger(CategoryService.name);

  /** Accesor para las operaciones CRUD de las categorias. */
  readonly #categories: Prisma.CategoryDelegate;

  constructor(private readonly prisma: PrismaService) {
    this.#categories = prisma.category;
  }

  async createCategory(name: string, description?: string): Promise<Category> {
    const category: Prisma.CategoryCreateInput = {
      name,
      description,
    };

    return await this.#categories.create({ data: category });
  }

  async getCategories(): Promise<Array<Category>> {
    return await this.#categories.findMany();
  }

  async getCategoryById(id: number): Promise<Category> {
    try {
      return await this.#categories.findUnique({ where: { id } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        throw new NotFoundException(
          `No se encontro la categoria con ID: ${id}`,
        );

      this.#logger.error(`Failed to search category by ID ${id}: ${e}`);
    }
  }
  async updateCategoryByid(id: number, data: Category) {
    return await this.#categories.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }
}
