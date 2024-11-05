import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Session,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Session() session) {
    return this.cartService.getCart(session.userId); // Cambia 'session' por 'session.userId' si está definido
  }

  @Post('add')
  addToCart(@Body() addItemDto: AddItemDto, @Session() session) {
    return this.cartService.addToCart(session.userId, addItemDto); // Cambia 'session' por 'session.userId' si está definido
  }

  @Put('update-quantity')
  updateQuantity(
    @Body() updateQuantityDto: UpdateQuantityDto,
    @Session() session,
  ) {
    return this.cartService.updateQuantity(session.userId, updateQuantityDto); // Asegúrate de que el método esté en el servicio
  }

  @Delete('remove/:productId')
  removeFromCart(@Param('productId') productId: string, @Session() session) {
    return this.cartService.removeProduct(session.userId, Number(productId)); // Convierte productId a número
  }

  @Post('checkout')
  checkout(@Session() session) {
    return this.cartService.clearCart(session.userId); // Asegúrate de que el método esté en el servicio
  }
}
