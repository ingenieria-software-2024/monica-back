import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma.service';
import { IProductService } from './product.interface';
import { CreateProductDto } from './dto/create.producto.dto';
import { UpdateProductDto } from './dto/update.producto.dto';
import { CategoryService } from '../category/category.service';
import { ICategoryService } from '../category/category.interface';
import { ISubCategoryService } from '../category/subcategory.interface';
import { VariantCategoryService } from '../category/variant/variant.category.service';

@Injectable()
export class ProductService implements IProductService {
  readonly #logger = new Logger(ProductService.name);

  //Accesor a las operaciones CRUD del producto en Prisma.
  readonly #products: Prisma.ProductDelegate;

  constructor(
    private readonly prisma: PrismaService,
    private readonly variantCategoryService: VariantCategoryService,
    @Inject(CategoryService) private readonly categories: ICategoryService,
    private readonly subCategories: ISubCategoryService,
  ) {
    this.#products = prisma.product;
  }

  //Creación de UN producto
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const {
      name,
      price,
      imageUrl,
      categoryId,
      isSubCategory,
      description,
      variants,
      variantCategory,
    } = createProductDto;

    // Búsqueda de la categoría o subcategoría primero.
    const category = isSubCategory
      ? await this.subCategories.getSubCategoryById(categoryId)
      : await this.categories.getCategoryById(categoryId);

    if (!category) {
      throw new NotFoundException(
        `No se encontró la ${isSubCategory ? 'subcategoría' : 'categoría'} con ID: ${categoryId}`,
      );
    }

    // Validación y manejo de la categoría de variante.
    let createdVariantCategoryId: number | undefined;

    if (variantCategory) {
      const { id } = variantCategory;
      const existingVariantCategory = id
        ? await this.variantCategoryService.getVariantCategoryById(id)
        : null;

      if (!existingVariantCategory) {
        const newVariantCategory =
          await this.variantCategoryService.createVariantCategory(
            variantCategory,
          );
        createdVariantCategoryId = newVariantCategory.id;
      } else {
        createdVariantCategoryId = existingVariantCategory.id;
      }
    }

    // Validación de las variantes, si existen.
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        if (
          !variant.name ||
          variant.stock == null ||
          variant.stockMin == null
        ) {
          throw new BadRequestException(
            'Cada variante debe tener un nombre, stock y stock mínimo.',
          );
        }
      }
    }

    //Creación de UN producto con sus variantes.
    const productData: Prisma.ProductCreateInput = {
      name,
      price,
      imageUrl,
      description,
      [isSubCategory ? 'subCategory' : 'category']: {
        connect: { id: categoryId },
      },
      ProductVariant: {
        create:
          variants?.map(({ name, description, stock, stockMin }) => ({
            name,
            description: description || null, // Asegurarse de que sea nulo si no está definido
            stock,
            stockMin,
            variantCategory: createdVariantCategoryId
              ? { connect: { id: createdVariantCategoryId } }
              : undefined,
          })) || [],
      },
    };

    try {
      return await this.#products.create({ data: productData });
    } catch (error) {
      this.#logger.error('Error al crear el producto', error);
      throw new InternalServerErrorException(
        'Error al crear el producto. Inténtelo de nuevo más tarde.',
      );
    }
  }
  //Obtención de TODOS los productos registrados
  async getProducts(): Promise<Array<Product>> {
    return await this.#products.findMany({
      where: { isDeleted: false }, // Filtrar los productos que no han sido eliminados lógicamente
      include: {
        ProductVariant: true, // Incluir las variantes de producto
      },
    });
  }
  //Obtención de UN producto por su ID
  async getProductById(id: number): Promise<Product> {
    const product = await this.#products.findUnique({
      where: { id, isDeleted: false }, // Filtrar los productos que no han sido eliminados lógicamente
      include: {
        ProductVariant: true, // Incluir las variantes de producto
      },
    });

    if (!product) {
      throw new NotFoundException(`No se encontró el producto con ID: ${id}`);
    }
    return product;
  }

  //Actualización de UN producto por su ID
  async updateProductById(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const {
      name,
      price,
      imageUrl,
      description,
      categoryId,
      subCategoryId,
      variants,
    } = updateProductDto;

    // Verificar si el producto existe.
    const existingProduct = await this.#products.findUnique({ where: { id } });

    if (!existingProduct) {
      throw new NotFoundException(`No se encontró el producto con ID: ${id}`);
    }

    // Validar la categoría o subcategoría si se proporciona.
    if (categoryId) {
      const category = await this.categories.getCategoryById(categoryId);
      if (!category) {
        throw new NotFoundException(
          `No se encontró la categoría con ID: ${categoryId}`,
        );
      }
    } else if (subCategoryId) {
      const subCategory =
        await this.subCategories.getSubCategoryById(subCategoryId);
      if (!subCategory) {
        throw new NotFoundException(
          `No se encontró la subcategoría con ID: ${subCategoryId}`,
        );
      }
    }

    // Mapear los `UpdateVariantDto` a solo los IDs
    const variantIds = variants
      ? variants.map((variant) => ({ id: variant.id }))
      : [];

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
        ...(variantIds.length && {
          ProductVariant: {
            connect: variantIds, // Conectar variantes por id
          },
        }),
      },
    });
  }
  //Borrado lógico de UN producto por su ID
  async deleteProduct(id: number): Promise<Product> {
    const existingProduct = await this.#products.findUnique({
      where: { id, isDeleted: false } // Filtro de eliminados con lógica
    });

    if (!existingProduct) {
      throw new NotFoundException(`No se encontró el producto con ID: ${id}`);
    }
    // Realizar un borrado lógico del producto
    return await this.#products.update({
      where: { id },
      data: { isDeleted: true }, // Realizar un borrado lógico del producto
    });
  }
}
