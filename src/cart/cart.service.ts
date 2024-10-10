import { Injectable } from '@nestjs/common';
import { CartItem } from './cart-item.interface';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';

@Injectable()
export class CartService {
  getCart(session: any): { cart: CartItem[]; total: number } {
    const cart: CartItem[] = session.cart || [];
    const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    return { cart, total };
  }

  addToCart(session: any, addItemDto: AddItemDto): CartItem[] {
    const cart: CartItem[] = session.cart || [];
    const itemIndex = cart.findIndex(
      (item) => item.productId === addItemDto.productId,
    );

    if (itemIndex > -1) {
      cart[itemIndex].quantity += addItemDto.quantity;
      cart[itemIndex].totalPrice =
        cart[itemIndex].price * cart[itemIndex].quantity;
    } else {
      cart.push({
        ...addItemDto,
        totalPrice: addItemDto.price * addItemDto.quantity,
      });
    }

    session.cart = cart;
    return cart;
  }

  updateQuantity(
    session: any,
    updateQuantityDto: UpdateQuantityDto,
  ): CartItem[] {
    const cart: CartItem[] = session.cart || [];
    const itemIndex = cart.findIndex(
      (item) => item.productId === updateQuantityDto.productId,
    );

    if (itemIndex > -1) {
      cart[itemIndex].quantity = updateQuantityDto.quantity;
      cart[itemIndex].totalPrice =
        cart[itemIndex].price * cart[itemIndex].quantity;
    }

    session.cart = cart;
    return cart;
  }

  removeFromCart(session: any, productId: string): CartItem[] {
    session.cart = session.cart.filter(
      (item: CartItem) => item.productId !== productId,
    );
    return session.cart;
  }

  checkout(session: any) {
    const cart: CartItem[] = session.cart || [];
    if (cart.length === 0) {
      throw new Error('El carrito está vacío');
    }

    session.cart = []; // Vaciar el carrito después del pago
    return { message: 'Compra realizada con éxito', cart };
  }
}
