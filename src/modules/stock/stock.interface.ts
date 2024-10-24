import { ProductVariant, Product } from '@prisma/client';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

export interface IStockService {
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
