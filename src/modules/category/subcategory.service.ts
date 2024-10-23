import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ISubCategoryService } from './subcategory.interface';
import { Prisma, SubCategory } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma.service';
import { CategoryService } from './category.service';
import { ICategoryService } from './category.interface';

@Injectable()
export class SubCategoryService implements ISubCategoryService {
  readonly #logger = new Logger(SubCategoryService.name);

  /** Accesor para las operaciones CRUD de una subcategoria. */
  readonly #subCategories: Prisma.SubCategoryDelegate;

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CategoryService) private readonly categories: ICategoryService,
  ) {
    this.#subCategories = prisma.subCategory;
  }

  async createSubCategory(
    name: string,
    parent: number,
    description?: string,
  ): Promise<SubCategory> {
    // Encontrar la categoria padre primero.
    const category = await this.categories.getCategoryById(parent);

    if (!category)
      throw new NotFoundException(
        `No se encontro la categoria con ID: ${parent}`,
      );

    // Crear la subcategoria.
    const subCategory: Prisma.SubCategoryCreateInput = {
      name,
      description,
      category: {
        connect: { id: parent },
      },
    };

    return await this.#subCategories.create({ data: subCategory });
  }

  async getSubCategories(): Promise<Array<SubCategory>> {
    return await this.#subCategories.findMany();
  }

  async getSubCategoryById(id: number): Promise<SubCategory> {
    return await this.#subCategories.findUnique({ where: { id } });
  }
}
