import { ProductVariant, User } from '@prisma/client';

export class UserCartDto {
  /** El usuario al cual pertenece este carrito. */
  user: User;

  /** El listado de productos dentro del carrito de este usuario actualmente. */
  products: Array<ProductVariant>;

  /** La cantidad total de productos en el carrito. */
  totalItems: number;

  /** El total a pagar por todos los productos en el carrito. */
  total: number;
}
