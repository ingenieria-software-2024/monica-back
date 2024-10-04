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
    return this.cartService.getCart(session);
  }

  @Post('add')
  addToCart(@Body() addItemDto: AddItemDto, @Session() session) {
    return this.cartService.addToCart(session, addItemDto);
  }

  @Put('update-quantity')
  updateQuantity(
    @Body() updateQuantityDto: UpdateQuantityDto,
    @Session() session,
  ) {
    return this.cartService.updateQuantity(session, updateQuantityDto);
  }

  @Delete('remove/:productId')
  removeFromCart(@Param('productId') productId: string, @Session() session) {
    return this.cartService.removeFromCart(session, productId);
  }

  @Post('checkout')
  checkout(@Session() session) {
    return this.cartService.checkout(session);
  }
}
