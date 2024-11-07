import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, SubCategory } from '@prisma/client';
import { ISubCategoryService } from './subcategory.interface';
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
  //Creación de UNA subcategoría
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
  //Obtención de TODAS las subcategorías
  async getSubCategories(): Promise<Array<SubCategory>> {
    const subCategories = await this.#subCategories.findMany({
      where: { isDeleted: false },
    });

    if (!subCategories.length) {
      throw new NotFoundException('No se encontraron subcategorías');
    }
    return subCategories;
  }
  //Obtención de UNA subcategoría por su ID
  async getSubCategoryById(id: number): Promise<SubCategory> {
    const subCategory = await this.#subCategories.findUnique({
      where: { id, isDeleted: false },
    });

    if (!subCategory) {
      throw new NotFoundException(
        `No se encontró la subcategoría con ID: ${id}`,
      );
    }
    return subCategory;
  }
  //Obtención de TODAS las subcategorías por ID su de categoría
  async getSubCategoriesByParent(
    categoryId: number,
  ): Promise<Array<SubCategory>> {
    const subCategories = await this.#subCategories.findMany({
      where: { category: { id: categoryId }, isDeleted: false },
    });

    if (!subCategories.length) {
      throw new NotFoundException(
        `No se encontraron subcategorías para la categoría con ID: ${categoryId}`,
      );
    }
    return subCategories;
  }
  //Borrado lógico de UNA subcategoría
  async DeleteSubCategory(id: number): Promise<SubCategory> {
    const subCategory = await this.getSubCategoryById(id);

    if (!subCategory) {
      throw new NotFoundException(
        `No se encontró la subcategoría con ID: ${id}`,
      );
    }
    // Realizar un borrado lógico estableciendo un campo `isDeleted` a `true`
    return await this.#subCategories.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
