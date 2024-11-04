import { ProductVariant } from '@prisma/client';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

export interface IProductVariantService {
  /**
   * Crea una nueva variante
   * @param {CreateVariantDto} createVariantDto
   * @returns {Promise<ProductVariant>}
   */
  createVariant(createVariantDto: CreateVariantDto): Promise<ProductVariant>;

  /**
   * Obtener listado de todas las variantes
   *
   * @returns {Promise<ProductVariant[]>}
   */
  getAllVariants(): Promise<ProductVariant[]>;

  /**
   * Busca una variante por su identificador.
   *
   * @param {number} id
   *
   * @returns {Promise<ProductVariant>}
   */
  getVariantById(id: number): Promise<ProductVariant>;

  /**
   * Busca las variantes asociadas a un producto por su ID.
   *
   * @param {number} productId La ID del producto padre del cual buscar las variantes.
   *
   * @returns {Promise<Array<ProductVariant>>} El listado de variantes presentes en un producto, si las hay.
   */
  getVariantsByProductId(productId: number): Promise<Array<ProductVariant>>;

  /**
   * Actualizar una variante registrada
   *
   * @param {number} id
   * @param {UpdateVariantDto} updateVariantDto
   *
   * @returns {Promise<ProductVariant>}
   */
  updateVariant(
    id: number,
    updateVariantDto: UpdateVariantDto,
  ): Promise<ProductVariant>;

  /**
   * Borrar alguna variante existente
   *
   * @param {number} id
   *
   * @returns {Promise<ProductVariant>}
   */
  deleteVariant(id: number): Promise<ProductVariant>;
}
