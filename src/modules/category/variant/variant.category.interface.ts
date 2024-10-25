import { VariantCategory, ProductVariant, Product } from '@prisma/client';
import { CreateVariantCategoryDto } from './dto/create.variant.category.dto';
import { UpdateVariantCategoryDto } from './dto/update.variant.category.dto';

export interface IVariantCategoryService {
  /**
   * Crea una nueva categoría de variante.
   * @param {CreateVariantCategoryDto} createVariantCategoryDto
   * @returns {Promise<VariantCategory>}
   */
  createVariantCategory(
    createVariantCategoryDto: CreateVariantCategoryDto,
  ): Promise<VariantCategory>;

  /**
   * Obtener listado de todas las categorías de variantes.
   *
   * @returns {Promise<VariantCategory[]>}
   */
  getAllVariantCategories(): Promise<VariantCategory[]>;

  /**
   * Busca una categoría de variante por su identificador.
   *
   * @param {number} id
   * @returns {Promise<VariantCategory>}
   */
  getVariantCategoryById(id: number): Promise<VariantCategory>;

  /**
   * Obtiene el stock por categoría de variante.
   *
   * @param {number} id El ID de la categoría de variante.
   * @returns {Promise<{
   *   variantCategory: VariantCategory;
   *   productVariant: ProductVariant;
   *   product: Product;
   *   stock: number;
   * }[]>}
   */
  getStockByVariantCategory(id: number): Promise<
    {
      variantCategory: VariantCategory;
      productVariant: ProductVariant;
      product: Product;
      stock: number;
    }[]
  >;
  /**
   * Actualizar una categoría de variante registrada.
   *
   * @param {number} id
   * @param {UpdateVariantCategoryDto} updateVariantCategoryDto
   * @returns {Promise<VariantCategory>}
   */
  updateVariantCategory(
    id: number,
    updateVariantCategoryDto: UpdateVariantCategoryDto,
  ): Promise<VariantCategory>;

  /**
   * Borrar alguna categoría de variante existente.
   *
   * @param {number} id
   * @returns {Promise<VariantCategory>}
   */
  deleteVariantCategory(id: number): Promise<VariantCategory>;
}
