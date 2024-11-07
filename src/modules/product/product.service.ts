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
import { IVariantCategoryService } from '../category/variant/variant.category.interface';
import { ProductVariantService } from './variants/product.variants.service';
import { IProductVariantService } from './variants/product.variants.interface';

@Injectable()
export class ProductService implements IProductService {
  readonly #logger = new Logger(ProductService.name);

  //Accesor a las operaciones CRUD del producto en Prisma.
  readonly #products: Prisma.ProductDelegate;

  constructor(
    private readonly prisma: PrismaService,
    @Inject(VariantCategoryService)
    private readonly variantCategoryService: IVariantCategoryService,
    @Inject(CategoryService) private readonly categories: ICategoryService,
    private readonly subCategories: ISubCategoryService,
    @Inject(ProductVariantService)
    private readonly productVariants: IProductVariantService,
  ) {
    this.#products = prisma.product;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const {
      name,
      defaultVariantImageUrl,
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
      defaultVariantImageUrl,
      description,
      [isSubCategory ? 'subCategory' : 'category']: {
        connect: { id: categoryId },
      },
      ProductVariant: {
        create:
          variants?.map(
            ({ name, description, price, imageUrl, stock, stockMin }) => ({
              name,
              description: description || null, // Asegurarse de que sea nulo si no está definido
              price,
              imageUrl,
              stock,
              stockMin,
              variantCategory: createdVariantCategoryId
                ? { connect: { id: createdVariantCategoryId } }
                : undefined,
            }),
          ) || [],
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

  async getProducts(): Promise<Array<Product>> {
    return await this.#products.findMany({
      where: { isDeleted: false }, // Filtrar los productos que no han sido eliminados lógicamente
      include: {
        ProductVariant: true, // Incluir las variantes de producto
      },
    });
  }

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

  async updateProductById(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const {
      name,
      defaultVariantImageUrl,
      description,
      categoryId,
      subCategoryId,
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

    // Obtener las variantes del producto.
    const variants = await this.productVariants.getVariantsByProductId(id);

    // Mapear los `UpdateVariantDto` a solo los IDs
    const variantIds = variants
      ? variants.map((variant) => ({ id: variant.id }))
      : [];

    // Actualizar el producto.
    return await this.#products.update({
      where: { id },
      data: {
        name,
        defaultVariantImageUrl,
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

  async deleteProduct(id: number): Promise<Product> {
    const existingProduct = await this.#products.findUnique({
      where: { id, isDeleted: false }, // Filtro de eliminados con lógica
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
