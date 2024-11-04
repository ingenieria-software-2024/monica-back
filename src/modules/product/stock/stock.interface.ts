import { ProductVariant } from '@prisma/client';

export interface IStockService {
  /**
   * Registra el agregado de un nuevo stock para un producto específico.
   *
   * @param {number} productId Identificador para el producto.
   * @param {number} quantity Cantidad de este producto que se agregará al stock.
   * @param {string} [reason] Opcional. Si es provista, una razon por la cual se agregó este stock.
   *
   * @returns {Promise<ProductVariant>} El producto con su stock actualizado.
   */
  addStock(
    productId: number,
    quantity: number,
    reason?: string,
  ): Promise<ProductVariant>;

  /**
   * Remueve una cantidad específica de stock para un producto específico.
   *
   * @param {number} productId Identificador para el producto.
   * @param {number} [quantity] Opcional. Cantidad de este producto que se removerá del stock. Si no se especifica, se restará 1.
   * @param {string} [reason] Opcional. Si es provista, una razon por la cual se removió este stock.
   *
   * @returns {Promise<ProductVariant>} El producto con su stock actualizado.
   */
  removeStock(
    productId: number,
    quantity?: number,
    reason?: string,
  ): Promise<ProductVariant>;
}
