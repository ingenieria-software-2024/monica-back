import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: number) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });
    const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    return { cart: cartItems, total };
  }

  async addToCart(userId: number, addItemDto: AddItemDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: addItemDto.productId },
    });

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: { userId, productId: addItemDto.productId },
    });

    if (existingCartItem) {
      await this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + addItemDto.quantity,
          totalPrice:
            product.price * (existingCartItem.quantity + addItemDto.quantity),
        },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          userId,
          productId: addItemDto.productId,
          quantity: addItemDto.quantity,
          totalPrice: product.price * addItemDto.quantity,
        },
      });
    }

    return this.getCart(userId);
  }

  async updateQuantity(userId: number, updateQuantityDto: UpdateQuantityDto) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: { userId, productId: updateQuantityDto.productId },
      include: { product: true },
    });

    if (!cartItem) {
      throw new Error('Producto no encontrado en el carrito');
    }

    // aca usamos cartItem.product para acceder al precio del producto
    await this.prisma.cartItem.update({
      where: { id: cartItem.id },
      data: {
        quantity: updateQuantityDto.quantity,
        totalPrice: cartItem.product.price * updateQuantityDto.quantity,
      },
    });

    return this.getCart(userId);
  }

  async removeFromCart(userId: number, productId: number) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: { userId, productId },
    });

    if (!cartItem) {
      throw new Error('Producto no encontrado en el carrito');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return this.getCart(userId);
  }

  async checkout(userId: number) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
    });

    await this.prisma.cartItem.deleteMany({
      where: { userId },
    });

    return { message: 'Checkout exitoso', cart: cartItems };
  }
}
