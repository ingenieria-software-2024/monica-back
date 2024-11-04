import { ProductVariant } from '@prisma/client';

export interface IStockService {
  /**
   * Registra el agregado de un nuevo stock para un producto específico.
   *
   * @param {number} productId Identificador para el producto.
   * @param {number} quantity Cantidad de este producto que se agregará al stock.
   *
   * @returns {Promise<ProductVariant>} El producto con su stock actualizado.
   */
  addStock(productId: number, quantity: number): Promise<ProductVariant>;

  /**
   * Remueve una cantidad específica de stock para un producto específico.
   *
   * @param {number} productId Identificador para el producto.
   * @param {number} [quantity] Opcional. Cantidad de este producto que se removerá del stock. Si no se especifica, se restará 1.
   *
   * @returns {Promise<ProductVariant>} El producto con su stock actualizado.
   */
  removeStock(productId: number, quantity?: number): Promise<ProductVariant>;
}
