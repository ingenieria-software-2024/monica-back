import { Injectable, Logger } from '@nestjs/common';
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
    return await this.#categories.findUnique({ where: { id } });
  }
}