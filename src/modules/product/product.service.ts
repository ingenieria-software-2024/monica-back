import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IProductService } from './product.interface';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma.service';
import { CategoryService } from '../category/category.service';
import { ICategoryService } from '../category/category.interface';
import { SubCategoryService } from '../category/subcategory.service';
import { ISubCategoryService } from '../category/subcategory.interface';
import { UpdateProductDto } from './dto/update.producto.dto';

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
  async getProducts(): Promise<Array<Product>> {
    return await this.#products.findMany();
  }
  async getProductById(id: number): Promise<Product> {
    return await this.#products.findUnique({ where: { id } });
  }
  async updateProductById(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const { name, price, imageUrl, description, categoryId, subCategoryId } = updateProductDto;
  
    // Verificar si el producto existe.
    const existingProduct = await this.#products.findUnique({ where: { id } });
  
    if (!existingProduct) {
      throw new NotFoundException(`No se encontró el producto con ID: ${id}`);
    }
  
    // Si se proporciona `categoryId` o `subCategoryId`, validar la relación.
    if (categoryId) {
      const category = await this.categories.getCategoryById(categoryId);
      if (!category) {
        throw new NotFoundException(`No se encontró la categoría con ID: ${categoryId}`);
      }
    } else if (subCategoryId) {
      const subCategory = await this.subCategories.getSubCategoryById(subCategoryId);
      if (!subCategory) {
        throw new NotFoundException(`No se encontró la subcategoría con ID: ${subCategoryId}`);
      }
    }
  
    // Actualizar el producto.
    return await this.#products.update({
      where: { id },
      data: {
        name,
        price,
        imageUrl,
        description,
        ...(categoryId && {
          category: {
            connect: { id: categoryId },
          },
        }),
        ...(subCategoryId && {
          subCategory: {
            connect: { id: subCategoryId },
          },
        }),
      },
    });
  }
}
