import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { ICartService } from './cart.interface';
import { UserCartDto } from './dto/user.cart.dto';
import { Prisma } from '@prisma/client';
import { ProductVariantService } from '../product/variants/product.variants.service';
import { IProductVariantService } from '../product/variants/product.variants.interface';

@Injectable()
export class CartService implements ICartService {
  readonly #logger: Logger = new Logger(CartService.name);

  /** Accesor para las operaciones CRUD del carrito de los usuarios. */
  readonly #cart: Prisma.CartItemDelegate;

  constructor(
    private readonly prisma: PrismaService,
    @Inject(ProductVariantService)
    private readonly productVariants: IProductVariantService,
  ) {
    this.#cart = prisma.cartItem;
  }

  /**
   * Obtiene el carrito de un usuario y computa el DTO de respuesta.
   *
   * @param {number} userId El ID del usuario a buscar el carrito.
   *
   * @returns {Promise<UserCartDto>} La información del carrito del usuario.
   */
  private async getUserCartInformation(userId: number): Promise<UserCartDto> {
    // Obtener todos los items del carrito del usuario.
    const cartItems = await this.#cart.findMany({
      where: { userId },
      include: { productVariant: true, user: true },
    });

    // Calcular el total del carrito en un momento dado.
    const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

    // Construir el DTO de respuesta.
    return {
      user: cartItems[0].user,
      products: cartItems.map((item) => item.productVariant),
      totalItems: cartItems.length,
      total,
    };
  }

  async getCart(userId: number): Promise<UserCartDto> {
    return await this.getUserCartInformation(userId);
  }

  async addToCart(
    userId: number,
    addItemDto: AddItemDto,
  ): Promise<UserCartDto> {
    // Desestructurar el DTO de agregar item.
    const { productVariantId, quantity } = addItemDto;

    // Buscar el producto que se desea agregar al carrito.
    const product = await this.productVariants.getVariantById(productVariantId);

    if (!product)
      throw new NotFoundException(
        `Producto con ID ${productVariantId} no encontrado`,
      );

    const existingCartItem = await this.#cart.findFirst({
      where: { userId, productVariantId },
    });

    // Si el item ya existe en el carrito, actualizar su cantidad.
    if (existingCartItem)
      await this.updateQuantity(userId, {
        productVariantId,
        quantity: existingCartItem.quantity + quantity,
      });
    // Caso contrario, crear nuevo item en el carrito.
    else
      await this.#cart.create({
        data: {
          userId,
          productVariantId: addItemDto.productVariantId,
          quantity: addItemDto.quantity,
          totalPrice: product.price * addItemDto.quantity,
        },
      });

    // Obtener el nuevo carrito del usuario.
    return await this.getCart(userId);
  }

  async updateQuantity(userId: number, updateQuantityDto: UpdateQuantityDto) {
    // Desestructurar el DTO de actualizar cantidad.
    const { productVariantId, quantity } = updateQuantityDto;

    // Buscar el item en el carrito que se desea actualizar.
    const cartItem = await this.#cart.findFirst({
      where: { userId, productVariantId },
      include: { productVariant: true },
    });

    if (!cartItem)
      throw new NotFoundException(
        'El producto indicado no fue encontrado en el carrito',
      );

    // Aca usamos cartItem.product para acceder al precio del producto.
    await this.#cart.update({
      where: { id: cartItem.id },
      data: {
        quantity: quantity,
        totalPrice: cartItem?.productVariant?.price * quantity,
      },
    });

    return this.getCart(userId);
  }

  async removeProduct(userId: number, productId: number) {
    // Buscar el item en el carrito que se desea eliminar.
    const cartItem = await this.#cart.findFirst({
      where: { userId, productVariantId: productId },
    });

    if (!cartItem)
      throw new NotFoundException(
        'El producto indicado no fue encontrado en el carrito',
      );

    // Eliminar el item del carrito.
    await this.prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return await this.getCart(userId);
  }

  async clearCart(userId: number) {
    // Eliminar todos los items del carrito del usuario.
    await this.#cart.deleteMany({
      where: { userId },
    });

    return await this.getCart(userId);
  }
}
