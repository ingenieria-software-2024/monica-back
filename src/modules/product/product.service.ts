import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IProductService } from './product.interface';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma.service';
import { CategoryService } from '../category/category.service';
import { ICategoryService } from '../category/category.interface';
import { SubCategoryService } from '../category/subcategory.service';
import { ISubCategoryService } from '../category/subcategory.interface';

@Injectable()
export class ProductService implements IProductService {
  readonly #logger = new Logger(ProductService.name);

  /** Accesor a las operaciones CRUD del producto en Prisma. */
  readonly #products: Prisma.ProductDelegate;

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CategoryService) private readonly categories: ICategoryService,
    @Inject(SubCategoryService)
    private readonly subCategories: ISubCategoryService,
  ) {
    this.#products = prisma.product;
  }

  async createProduct(
    name: string,
    price: number,
    image: string,
    category: number,
    isSubCategory: boolean,
    description?: string,
  ): Promise<Product> {
    // Buscar la categoria primero.
    const cat = isSubCategory
      ? await this.subCategories.getSubCategoryById(category)
      : await this.categories.getCategoryById(category);

    if (!cat)
      throw new NotFoundException(
        `No se encontro la categoria con ID: ${category}`,
      );

    // Crear el producto.
    const product: Prisma.ProductCreateInput = {
      name,
      price,
      imageUrl: image,
      description,
      [isSubCategory ? 'subCategory' : 'category']: {
        connect: { id: category },
      },
    };

    return await this.#products.create({ data: product });
  }

  async getProduct(id: number): Promise<Product> {
    return await this.#products.findUnique({ where: { id } });
  }
}
