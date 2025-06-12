import { AddItemDto } from './dto/add-item.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { UserCartDto } from './dto/user.cart.dto';

export interface ICartService {
  /**
   * Obtiene el carrito actual de un usuario específico.
   *
   * @param {number} userId El ID de usuario a buscar.
   *
   * @returns {Promise<UserCartDto>} Información del carrito del usuario.
   */
  getCart(userId: number): Promise<UserCartDto>;

  /**
   * Agrega un nuevo item al carrito de un usuario.
   *
   * @param {number} userId El ID de usuario a buscar.
   * @param {AddItemDto} addItemDto La información del item a agregar.
   *
   * @returns {Promise<UserCartDto>} Información del carrito del usuario con su nuevo item.
   */
  addToCart(userId: number, addItemDto: AddItemDto): Promise<UserCartDto>;

  /**
   * Actualiza la cantidad de un item especifico dentro del carrito de un usuario.
   *
   * @param {number} userId El ID de usuario a buscar.
   * @param {UpdateQuantityDto} updateQuantityDto La información de la actualización de cantidad.
   *
   * @returns {Promise<UserCartDto>} Información del carrito del usuario con la cantidad actualizada.
   */
  updateQuantity(
    userId: number,
    updateQuantityDto: UpdateQuantityDto,
  ): Promise<UserCartDto>;

  /**
   * Elimina un producto del carrito del usuario.
   *
   * @param {number} userId El ID de usuario a buscar.
   * @param {number} productId El ID de producto a eliminar.
   *
   * @returns {Promise<UserCartDto>} Información del carrito del usuario con el producto eliminado.
   */
  removeProduct(userId: number, productId: number): Promise<UserCartDto>;

  /**
   * Limpia el carrito del usuario.
   *
   * @param {number} userId El ID de usuario a buscar.
   *
   * @returns {Promise<UserCartDto>} Información del carrito del usuario vacío.
   */
  clearCart(userId: number): Promise<UserCartDto>;
}
